import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  apartmentNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phoneNumber: z.string().optional(),
  apartmentName: z.string().optional(),
  apartmentNumber: z.string().optional(),
  floorNumber: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in
  const { data: userData, isLoading } = useQuery<User | null>({
    queryKey: ["/api/me"],
    queryFn: getQueryFn({ on401: "returnNull" }) as () => Promise<User | null>,
    enabled: true,
    refetchOnWindowFocus: false,
  });

  // Set user data when it's loaded from API
  useEffect(() => {
    if (userData) {
      setUser(userData as User);
    }
  }, [userData]);

  async function login(username: string, password: string) {
    try {
      const res = await apiRequest("POST", "/api/login", { username, password });
      const userData = await res.json();
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userData.fullName}!`,
      });
      navigate("/");
      return userData;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function register(userData: RegisterData) {
    try {
      const res = await apiRequest("POST", "/api/register", userData);
      const newUser = await res.json();
      setUser(newUser);
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({
        title: "Registration successful",
        description: `Welcome, ${newUser.fullName}!`,
      });
      navigate("/");
      return newUser;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await apiRequest("POST", "/api/logout", {});
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out",
        variant: "destructive",
      });
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper for auth queries to handle 401s gracefully
function getQueryFn<T>({ on401 }: { on401: "returnNull" | "throw" }) {
  return async ({ queryKey }: { queryKey: readonly unknown[] }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    
    return await res.json() as T;
  };
}
