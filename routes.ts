import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  insertUserSchema,
  insertAppointmentSchema,
  insertCommunityPostSchema,
  insertPostTagSchema,
  insertPostLikeSchema,
} from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  const sessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "apt-connect-secret",
      resave: false,
      saveUninitialized: false,
      store: new sessionStore({ checkPeriod: 86400000 }),
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        if (user.password !== password) {
          // In a real app, use bcrypt to compare passwords
          return done(null, false, { message: "Incorrect username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const user = await storage.createUser(userData);
      
      // Auto-login after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login after registration" });
        }
        return res.status(201).json({ 
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          apartmentNumber: user.apartmentNumber
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    res.json({ 
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      apartmentNumber: user.apartmentNumber
    });
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", isAuthenticated, (req, res) => {
    const user = req.user as any;
    res.json({ 
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      apartmentNumber: user.apartmentNumber
    });
  });

  // Service categories routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const categoryId = parseInt(req.params.id);
    const category = await storage.getCategoryById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });

  // Service providers routes
  app.get("/api/providers", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    
    let providers;
    if (categoryId) {
      providers = await storage.getServiceProvidersByCategory(categoryId);
    } else {
      providers = await storage.getAllServiceProviders();
    }
    
    res.json(providers);
  });

  app.get("/api/providers/:id", async (req, res) => {
    const providerId = parseInt(req.params.id);
    const provider = await storage.getServiceProviderById(providerId);
    
    if (!provider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    
    res.json(provider);
  });

  // Appointments routes
  app.get("/api/appointments", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const appointments = await storage.getAppointmentsByUserId(user.id);
    
    // Get additional info for each appointment
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const provider = await storage.getServiceProviderById(appointment.serviceProviderId);
        const category = await storage.getCategoryById(appointment.categoryId);
        
        return {
          ...appointment,
          provider,
          category,
        };
      })
    );
    
    res.json(appointmentsWithDetails);
  });

  app.post("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      console.log("Appointment request body:", JSON.stringify(req.body));
      const user = req.user as any;
      
      // Format date properly if it's a string or Date object
      let formattedData = { ...req.body };
      if (formattedData.date) {
        if (typeof formattedData.date === 'string') {
          formattedData.date = new Date(formattedData.date);
        } else if (formattedData.date instanceof Date) {
          // Keep as is, but ensure it's valid
          if (isNaN(formattedData.date.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
          }
        }
      }
      
      console.log("Formatted appointment data:", JSON.stringify({
        ...formattedData,
        userId: user.id,
        date: formattedData.date ? formattedData.date.toISOString() : null
      }));
      
      const appointmentData = insertAppointmentSchema.parse({
        ...formattedData,
        userId: user.id,
      });
      
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zod validation error:", JSON.stringify(error.errors));
        return res.status(400).json({ message: error.errors });
      }
      console.error("Server error:", error);
      res.status(500).json({ message: "Server error creating appointment" });
    }
  });

  app.patch("/api/appointments/:id/status", isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { status } = req.body;
      
      const appointment = await storage.getAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      // Ensure user owns this appointment
      const user = req.user as any;
      if (appointment.userId !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this appointment" });
      }
      
      const updatedAppointment = await storage.updateAppointmentStatus(appointmentId, status);
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Server error updating appointment" });
    }
  });

  // Community posts routes
  app.get("/api/posts", async (req, res) => {
    const posts = await storage.getAllCommunityPosts();
    
    // Get user info and tags for each post
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await storage.getUser(post.userId);
        const tags = await storage.getTagsByPostId(post.id);
        
        // Check if current user has liked this post
        let userLiked = false;
        if (req.isAuthenticated()) {
          const userId = (req.user as any).id;
          userLiked = await storage.hasUserLikedPost(post.id, userId);
        }
        
        return {
          ...post,
          user: user ? {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            apartmentNumber: user.apartmentNumber,
          } : undefined,
          tags: tags.map((tag) => tag.tagName),
          userLiked,
        };
      })
    );
    
    // Sort by most recent first
    postsWithDetails.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    res.json(postsWithDetails);
  });

  app.post("/api/posts", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const postData = insertCommunityPostSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const post = await storage.createCommunityPost(postData);
      
      // Add tags if provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tagName of req.body.tags) {
          await storage.createPostTag({
            postId: post.id,
            tagName,
          });
        }
      }
      
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error creating post" });
    }
  });

  app.post("/api/posts/:id/like", isAuthenticated, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const user = req.user as any;
      
      // Check if post exists
      const post = await storage.getCommunityPostById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user already liked the post
      const hasLiked = await storage.hasUserLikedPost(postId, user.id);
      if (hasLiked) {
        // Unlike the post
        await storage.deletePostLike(postId, user.id);
        const updatedPost = await storage.getCommunityPostById(postId);
        return res.json({ liked: false, post: updatedPost });
      }
      
      // Like the post
      await storage.createPostLike({
        postId,
        userId: user.id,
      });
      
      // Increment like count on the post
      const updatedPost = await storage.incrementPostLikes(postId);
      res.json({ liked: true, post: updatedPost });
    } catch (error) {
      res.status(500).json({ message: "Server error processing like" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
