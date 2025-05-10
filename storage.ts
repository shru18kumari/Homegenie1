import {
  users,
  User,
  InsertUser,
  serviceCategories,
  ServiceCategory,
  InsertServiceCategory,
  serviceProviders,
  ServiceProvider,
  InsertServiceProvider,
  appointments,
  Appointment,
  InsertAppointment,
  communityPosts,
  CommunityPost,
  InsertCommunityPost,
  postTags,
  PostTag,
  InsertPostTag,
  postLikes,
  PostLike,
  InsertPostLike,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Service Categories
  getAllCategories(): Promise<ServiceCategory[]>;
  getCategoryById(id: number): Promise<ServiceCategory | undefined>;
  createCategory(category: InsertServiceCategory): Promise<ServiceCategory>;

  // Service Providers
  getAllServiceProviders(): Promise<ServiceProvider[]>;
  getServiceProvidersByCategory(categoryId: number): Promise<ServiceProvider[]>;
  getServiceProviderById(id: number): Promise<ServiceProvider | undefined>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;

  // Appointments
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;

  // Community Posts
  getAllCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPostById(id: number): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  incrementPostLikes(postId: number): Promise<CommunityPost | undefined>;
  incrementPostComments(postId: number): Promise<CommunityPost | undefined>;

  // Post Tags
  getTagsByPostId(postId: number): Promise<PostTag[]>;
  createPostTag(tag: InsertPostTag): Promise<PostTag>;

  // Post Likes
  getPostLikesByUser(userId: number): Promise<PostLike[]>;
  createPostLike(like: InsertPostLike): Promise<PostLike>;
  deletePostLike(postId: number, userId: number): Promise<boolean>;
  hasUserLikedPost(postId: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private serviceCategories: Map<number, ServiceCategory>;
  private serviceProviders: Map<number, ServiceProvider>;
  private appointments: Map<number, Appointment>;
  private communityPosts: Map<number, CommunityPost>;
  private postTags: Map<number, PostTag>;
  private postLikes: Map<number, PostLike>;

  private currentIds: {
    users: number;
    serviceCategories: number;
    serviceProviders: number;
    appointments: number;
    communityPosts: number;
    postTags: number;
    postLikes: number;
  };

  constructor() {
    this.users = new Map();
    this.serviceCategories = new Map();
    this.serviceProviders = new Map();
    this.appointments = new Map();
    this.communityPosts = new Map();
    this.postTags = new Map();
    this.postLikes = new Map();

    this.currentIds = {
      users: 1,
      serviceCategories: 1,
      serviceProviders: 1,
      appointments: 1,
      communityPosts: 1,
      postTags: 1,
      postLikes: 1,
    };

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample service categories
    const categories = [
      {
        name: "Maintenance",
        description: "General maintenance issues",
        icon: "tools-line",
        color: "primary",
      },
      {
        name: "Plumbing",
        description: "Water and pipe related issues",
        icon: "drop-line",
        color: "secondary",
      },
      {
        name: "Electrical",
        description: "Electrical and power related issues",
        icon: "plug-line",
        color: "accent",
      },
      {
        name: "HVAC",
        description: "Heating, ventilation, and air conditioning",
        icon: "home-gear-line",
        color: "success",
      },
    ];

    categories.forEach(category => {
      this.createCategory(category);
    });

    // Add sample service providers
    const providers = [
      {
        name: "Richard's Plumbing",
        description: "Expert plumbing services for all your needs",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryId: 2, // Plumbing
        rating: 49, // 4.9
        isVerified: true,
        responseTime: "Fast Response",
        badgeOne: "Fast Response",
        badgeTwo: "Certified",
      },
      {
        name: "Elite Electric",
        description: "Professional electrical repairs and installations",
        imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryId: 3, // Electrical
        rating: 47, // 4.7
        isVerified: true,
        responseTime: "Fast Response",
        badgeOne: "Insured",
        badgeTwo: "Same-day",
      },
      {
        name: "Cool Comfort HVAC",
        description: "Heating, cooling and ventilation experts",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryId: 4, // HVAC
        rating: 48, // 4.8
        isVerified: true,
        responseTime: "Fast Response",
        badgeOne: "On Time",
        badgeTwo: "Best Value",
      },
      {
        name: "Fix It Fast",
        description: "Quick repairs for everyday problems",
        imageUrl: "https://images.unsplash.com/photo-1590479773265-7464e5d48118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryId: 1, // Maintenance
        rating: 45, // 4.5
        isVerified: true,
        responseTime: "Same-day",
        badgeOne: "Reliable",
        badgeTwo: "Affordable",
      },
      {
        name: "Advanced Electrical Solutions",
        description: "Comprehensive electrical services",
        imageUrl: "https://images.unsplash.com/photo-1621905252782-44e14eb40b4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryId: 3, // Electrical
        rating: 46, // 4.6
        isVerified: true,
        responseTime: "Fast Response",
        badgeOne: "Licensed",
        badgeTwo: "Professional",
      },
      {
        name: "Premium Plumbing",
        description: "High-quality plumbing services",
        imageUrl: "https://images.unsplash.com/photo-1606224547099-b7f9a81b25a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryId: 2, // Plumbing
        rating: 47, // 4.7
        isVerified: true,
        responseTime: "Fast Response",
        badgeOne: "Experienced",
        badgeTwo: "Quality Work",
      },
    ];

    providers.forEach(provider => {
      this.createServiceProvider(provider);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Service Categories
  async getAllCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }

  async getCategoryById(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }

  async createCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.currentIds.serviceCategories++;
    const category: ServiceCategory = { ...insertCategory, id };
    this.serviceCategories.set(id, category);
    return category;
  }

  // Service Providers
  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values());
  }

  async getServiceProvidersByCategory(categoryId: number): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values()).filter(
      (provider) => provider.categoryId === categoryId,
    );
  }

  async getServiceProviderById(id: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.get(id);
  }

  async createServiceProvider(insertProvider: InsertServiceProvider): Promise<ServiceProvider> {
    const id = this.currentIds.serviceProviders++;
    const provider: ServiceProvider = { ...insertProvider, id };
    this.serviceProviders.set(id, provider);
    return provider;
  }

  // Appointments
  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId,
    );
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentIds.appointments++;
    const createdAt = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      const updatedAppointment = { ...appointment, status: status as any };
      this.appointments.set(id, updatedAppointment);
      return updatedAppointment;
    }
    return undefined;
  }

  // Community Posts
  async getAllCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values());
  }

  async getCommunityPostById(id: number): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = this.currentIds.communityPosts++;
    const createdAt = new Date();
    const post: CommunityPost = { 
      ...insertPost, 
      id, 
      createdAt, 
      likesCount: 0, 
      commentsCount: 0 
    };
    this.communityPosts.set(id, post);
    return post;
  }

  async incrementPostLikes(postId: number): Promise<CommunityPost | undefined> {
    const post = this.communityPosts.get(postId);
    if (post) {
      const updatedPost = { ...post, likesCount: post.likesCount + 1 };
      this.communityPosts.set(postId, updatedPost);
      return updatedPost;
    }
    return undefined;
  }

  async incrementPostComments(postId: number): Promise<CommunityPost | undefined> {
    const post = this.communityPosts.get(postId);
    if (post) {
      const updatedPost = { ...post, commentsCount: post.commentsCount + 1 };
      this.communityPosts.set(postId, updatedPost);
      return updatedPost;
    }
    return undefined;
  }

  // Post Tags
  async getTagsByPostId(postId: number): Promise<PostTag[]> {
    return Array.from(this.postTags.values()).filter(
      (tag) => tag.postId === postId,
    );
  }

  async createPostTag(insertTag: InsertPostTag): Promise<PostTag> {
    const id = this.currentIds.postTags++;
    const tag: PostTag = { ...insertTag, id };
    this.postTags.set(id, tag);
    return tag;
  }

  // Post Likes
  async getPostLikesByUser(userId: number): Promise<PostLike[]> {
    return Array.from(this.postLikes.values()).filter(
      (like) => like.userId === userId,
    );
  }

  async createPostLike(insertLike: InsertPostLike): Promise<PostLike> {
    const id = this.currentIds.postLikes++;
    const like: PostLike = { ...insertLike, id };
    this.postLikes.set(id, like);
    return like;
  }

  async deletePostLike(postId: number, userId: number): Promise<boolean> {
    const like = Array.from(this.postLikes.values()).find(
      (like) => like.postId === postId && like.userId === userId,
    );
    
    if (like) {
      this.postLikes.delete(like.id);
      return true;
    }
    
    return false;
  }

  async hasUserLikedPost(postId: number, userId: number): Promise<boolean> {
    return Array.from(this.postLikes.values()).some(
      (like) => like.postId === postId && like.userId === userId,
    );
  }
}

// Database implementation
import { db } from "./db";
import { 
  users, serviceCategories, serviceProviders, 
  appointments, communityPosts, postTags, postLikes,
  appointmentStatusEnum
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
      })
      .returning();
    return user;
  }

  async getAllCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async getCategoryById(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const [category] = await db
      .insert(serviceCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    return await db.select().from(serviceProviders);
  }

  async getServiceProvidersByCategory(categoryId: number): Promise<ServiceProvider[]> {
    return await db.select().from(serviceProviders).where(eq(serviceProviders.categoryId, categoryId));
  }

  async getServiceProviderById(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
    return provider || undefined;
  }

  async createServiceProvider(insertProvider: InsertServiceProvider): Promise<ServiceProvider> {
    const [provider] = await db
      .insert(serviceProviders)
      .values(insertProvider)
      .returning();
    return provider;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.userId, userId));
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values({
        ...insertAppointment,
        createdAt: new Date(),
      })
      .returning();
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ status: status as typeof appointmentStatusEnum.enumValues[number] })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment || undefined;
  }

  async getAllCommunityPosts(): Promise<CommunityPost[]> {
    return await db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt));
  }

  async getCommunityPostById(id: number): Promise<CommunityPost | undefined> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, id));
    return post || undefined;
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const [post] = await db
      .insert(communityPosts)
      .values({
        ...insertPost,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date(),
      })
      .returning();
    return post;
  }

  async incrementPostLikes(postId: number): Promise<CommunityPost | undefined> {
    const post = await this.getCommunityPostById(postId);
    if (!post) return undefined;
    
    const [updatedPost] = await db
      .update(communityPosts)
      .set({ likesCount: post.likesCount + 1 })
      .where(eq(communityPosts.id, postId))
      .returning();
    return updatedPost || undefined;
  }

  async incrementPostComments(postId: number): Promise<CommunityPost | undefined> {
    const post = await this.getCommunityPostById(postId);
    if (!post) return undefined;
    
    const [updatedPost] = await db
      .update(communityPosts)
      .set({ commentsCount: post.commentsCount + 1 })
      .where(eq(communityPosts.id, postId))
      .returning();
    return updatedPost || undefined;
  }

  async getTagsByPostId(postId: number): Promise<PostTag[]> {
    return await db.select().from(postTags).where(eq(postTags.postId, postId));
  }

  async createPostTag(insertTag: InsertPostTag): Promise<PostTag> {
    const [tag] = await db
      .insert(postTags)
      .values(insertTag)
      .returning();
    return tag;
  }

  async getPostLikesByUser(userId: number): Promise<PostLike[]> {
    return await db.select().from(postLikes).where(eq(postLikes.userId, userId));
  }

  async createPostLike(insertLike: InsertPostLike): Promise<PostLike> {
    const [like] = await db
      .insert(postLikes)
      .values(insertLike)
      .returning();
    return like;
  }

  async deletePostLike(postId: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    return true;
  }

  async hasUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const [like] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    return !!like;
  }
}

// Use Database Storage instead of Memory Storage
export const storage = new DatabaseStorage();
