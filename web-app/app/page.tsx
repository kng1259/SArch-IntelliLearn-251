"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const authContext = useAuth();
  const router = useRouter();

  console.log("Current user:", authContext);

  if (!authContext.user) {
    router.push("/signin");
  }

  if (authContext.user?.role === "student") {
    router.push("/student/dashboard");
  }

  if (authContext.user?.role === "tutor") {
    router.push("/tutor/dashboard");
  }
}
