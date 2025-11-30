"use client";

import { LocalUserInfo, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: LocalUserInfo | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: LocalUserInfo[] = [
  {
    id: "101",
    name: "Alex Johnson",
    email: "student@example.com",
    role: "student",
  },
  {
    id: "102",
    name: "Dr. Sarah Williams",
    email: "tutor@example.com",
    role: "tutor",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LocalUserInfo | null>(
    JSON.parse(localStorage.getItem("lms_user") || "null")
  );
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("lms_user");

    if (storedUser) {
      Promise.resolve().then(() => setUser(JSON.parse(storedUser)));
    }

    Promise.resolve().then(() => setIsLoading(false));
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.role === role
    );
    if (foundUser) {
      setUser(foundUser);
      window.localStorage.setItem("lms_user", JSON.stringify(foundUser));
      return true;
    }
    alert("Invalid credentials");
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    // const newUser: User = {
    //   id: String(mockUsers.length + 1),
    //   name,
    //   email,
    //   role: 'student',
    //   department: 'Undeclared',
    //   bio: '',
    // };
    // mockUsers.push(newUser);
    // setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lms_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
