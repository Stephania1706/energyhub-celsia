"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { getCelsiaLogoUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface UserMenuProps {
  sidebarOpen?: boolean;
  mobile?: boolean;
}

export function UserMenu({ sidebarOpen = false, mobile = false }: UserMenuProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return null;

  if (mobile) {
    return (
      <Link href="/profile" className="p-2 rounded-full hover:bg-orange-50 transition-colors group">
        <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-orange-200 overflow-hidden">
          <Avatar className="h-full w-full">
            <AvatarImage 
              src={getCelsiaLogoUrl()} 
              alt={user.nombre}
              className="object-contain bg-white p-1 rounded-full"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <User className="h-3 w-3 text-white" />
            </AvatarFallback>
          </Avatar>
        </div>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 hover:bg-accent/50 p-2 h-auto">
          <Avatar className={cn(
            sidebarOpen ? "h-8 w-8" : "h-10 w-10",
            "ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
          )}>
            <AvatarImage 
              src={getCelsiaLogoUrl()} 
              alt={user.nombre}
              className="object-contain bg-white p-1 rounded-full"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <User className={cn(
                sidebarOpen ? "h-4 w-4" : "h-5 w-5",
                "text-white"
              )} />
            </AvatarFallback>
          </Avatar>

          {sidebarOpen && (
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{user.nombre}</p>
              <p className="text-xs text-muted-foreground">{user.contractId}</p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full">
            Perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full">
            Configuración
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

