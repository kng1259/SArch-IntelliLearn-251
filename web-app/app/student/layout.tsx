"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authContext = useAuth();

  if (!authContext.user) {
    redirect("/signin");
  }

  if (authContext.user?.role !== "student") {
    redirect("/tutor/dashboard");
  }

  return <>{children}</>;
}
