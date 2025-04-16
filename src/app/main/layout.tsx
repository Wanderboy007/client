// app/main/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store"; // Adjust the path to your store file

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.id) {
      router.push("/login"); // Redirect if not logged in
    }
  }, [user, router]);

  if (!user.id) return null; // Optional: show a loader while redirecting

  return <>{children}</>;
}
