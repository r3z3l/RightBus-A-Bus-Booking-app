"use client";

import Navbar from "@/components/navbar";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { state } = useAuth();

  if (!state.isLoggedIn) {
    router.replace("/login");
    return null;
  }

  const { user } = state;

  if (user && user.role === "admin") {
    router.replace("/dashboard");
    return null;
  }
  return (
    <div className="w-full min-h-screen bg-slate-200">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default MainLayout;
