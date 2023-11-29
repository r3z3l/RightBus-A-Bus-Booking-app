"use client";

import { Ticket, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const Navbar = () => {
  const { state, handleLogout } = useAuth();
  const { user } = state;

  return (
    <div className="w-full py-4 px-8 sm:py-6 sm:px-16 flex items-center justify-between bg-rose-800 shadow-2xl shadow-slate-400 border-b-4">
      <h3 className="font-semibold text-[#fafbfc] text-xl tracking-wide flex items-center gap-2">
        <Ticket className="h-6 w-6" /> RightBus
      </h3>
      <div className="flex items-center gap-3 text-white">
        <p>{user?.name}</p>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
