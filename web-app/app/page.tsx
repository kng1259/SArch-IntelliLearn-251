"use client";

import authService from "@/lib/services/authService";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      redirect("/signin");
    }

    if (authService.isStudent()) {
      redirect("/student/dashboard");
    }

    if (authService.isTutor()) {
      redirect("/tutor/dashboard");
    }
  }, []);
}
