import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiClient } from "@/integrations/api/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "job_seeker" | "employer" | "admin";
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: "job_seeker" | "employer") => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user profile
      apiClient.getProfile()
        .then(({ user }) => {
          setUser(user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: "job_seeker" | "employer") => {
    try {
      const { token, user } = await apiClient.register(email, password, fullName, role);

      localStorage.setItem('token', token);
      setUser(user);

      toast.success("Account created successfully!");
      navigate("/");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign up");
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user } = await apiClient.login(email, password);

      localStorage.setItem('token', token);
      setUser(user);

      toast.success("Signed in successfully!");
      navigate("/dashboard");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign in");
      return { error };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);

      toast.success("Signed out successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
