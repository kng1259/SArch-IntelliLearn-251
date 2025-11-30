import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor Dashboard | IntelliLearn",
  description: "Manage your courses, students, and educational content",
};

export default function TutorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
