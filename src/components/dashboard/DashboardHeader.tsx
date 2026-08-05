"use client";

import { Zap, Menu, User, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getCelsiaLogoUrl } from "@/lib/url-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/ui/notification-dropdown";

export default function DashboardHeader() {

  const goTo = (path: string) => {
  window.location.href = path;
};

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <div className="flex items-center gap-6">
          <div onClick={() => goTo("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">EnergyHub</h1>
              <p className="text-xs text-muted-foreground">Gestión Energética</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => goTo("/")}>Dashboard</Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/tarifas")}>Tarifas</Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/eco-feedback")}>Eco-Feedback</Button>
            <Button variant="ghost" size="sm" onClick={() => goTo("/mapa-cortes")}>Mapa de Cortes</Button>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="hidden lg:flex items-center relative w-64">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-9" />
          </div>

          <NotificationDropdown />

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={getCelsiaLogoUrl()} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">Mi Empresa S.A.S</p>
                  <p className="text-xs text-muted-foreground">Celsia</p>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Facturación</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

        </div>
      </div>
    </header>
  );
}