"use client";

import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationDropdown from "@/components/ui/notification-dropdown";

export default function TopNavbar() {
  const [localUser, setLocalUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setLocalUser(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (!confirmLogout) return;

    localStorage.removeItem("user");
    window.location.href = "/energyhub-celsia";
  };

  if (pathname === "/") return null;

  return (
    <div className="h-16 bg-gray-500 border-b flex items-center justify-between px-6 fixed top-0 left-0 z-50 w-full max-w-full overflow-x-hidden"> 
      
      {/* Logo */}
      <div className="font-semibold text-gray-700"> 
        <img src="/energyhub-celsia/Iconos/sidebar/logoc.png" alt="Celsia" className="h-10 ms-10"/> 
      </div> 

      {/* Saludo */}
      <span className="text-2xl me-10 font-bold text-white">
        ¡Hola, {localUser?.nombre || "Invitado"}!
      </span> 

      {/* Acciones */}
      <div className="flex items-center gap-3 max-w-full overflow-hidden pr-2"> 
        
        {/* Avatar */}
        <img
          src={`https://ui-avatars.com/api/?name=${localUser?.nombre}&background=F97316&color=fff`}
          alt="avatar"
          className="w-8 h-8 rounded-full shrink-0"
        />

      <div className="relative flex items-center justify-center">
          <NotificationDropdown />
        </div>
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 ms-4 rounded-lg border hover:bg-red-50 hover:text-red-500 transition"
        >
          <LogOut size={16} />
        </button>

      </div> 
    </div>
  );
}