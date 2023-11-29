"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { state } = useAuth();

  if (state.user !== "admin") {
    return router.push("/");
  }

  return <div>Dashboard</div>;
};

export default Dashboard;
