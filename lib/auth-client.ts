"use client";

// Mock auth client for demo purposes
// In production, integrate with better-auth properly

export const signIn = {
  email: async (
    credentials: { email: string; password: string },
    callbacks?: {
      onSuccess?: () => void;
      onError?: (ctx: any) => void;
    }
  ) => {
    // Mock auth - in production use proper authentication
    localStorage.setItem("user", JSON.stringify({
      id: "1",
      email: credentials.email,
      name: "User",
      role: "admin"
    }));
    callbacks?.onSuccess?.();
  }
};

export const signUp = {
  email: async (
    credentials: { email: string; password: string; name: string },
    callbacks?: {
      onSuccess?: () => void;
      onError?: (ctx: any) => void;
    }
  ) => {
    localStorage.setItem("user", JSON.stringify({
      id: "1",
      email: credentials.email,
      name: credentials.name,
      role: "worker"
    }));
    callbacks?.onSuccess?.();
  }
};

export const signOut = async () => {
  localStorage.removeItem("user");
};

export const useSession = () => {
  const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  return {
    data: user ? { user: JSON.parse(user) } : null,
  };
};
