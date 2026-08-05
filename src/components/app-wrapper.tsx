"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Zap, Lock, Unlock, House, ArrowLeftRight, LayoutDashboard, Leaf, BadgeDollarSign, Map } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserMenu } from "@/components/user-menu";
import { getAssetUrl } from "@/lib/url-utils";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import TopNavbar from "@/components/dashboard/TopNavbar";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname.includes("login");

  const sidebarLinks = [
    {
      label: "Inicio",
      href: "/dashboard",
      icon: <House className="text-orange-500 h-6 w-6" />,
    },
    {
      label: "Reporte ejecutivo",
      href: "/reporte",
      icon: <LayoutDashboard className="text-orange-500 h-6 w-6" />,
    },
    {
      label: "Informe Energía",
      href: "/eco-feedback",
      icon: <Leaf className="text-orange-500 h-6 w-6" />,
    },
    {
      label: "Mi tarifa",
      href: "/tarifas",
      icon: <BadgeDollarSign className="text-orange-500 h-6 w-6" />,
    },
    {
      label: "Estado Servicio",
      href: "/mapa-cortes",
      icon: <Map className="text-orange-500 h-6 w-6" />,
    },
    {
      label: "Simulación de Tarifas",
      href: "/simulador-tarifas",
      icon: <ArrowLeftRight className="text-orange-500 h-6 w-6" />,
    },
    {
      label: "Comparación entre sedes",
      href: "/comparacion",
      icon: (
        <Image src={getAssetUrl("/Iconos/sidebar/sedes.png")} alt="Comparación" width={36} height={36} />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">

      {/* Desktop Sidebar - Hide on landing page */}
          {!isAuthPage && (
            <div className="hidden md:block">
              <Sidebar 
                open={sidebarOpen} 
                setOpen={sidebarLocked ? undefined : setSidebarOpen}
              >
                <SidebarBody 
                  open={sidebarOpen} 
                  setOpen={sidebarLocked ? undefined : setSidebarOpen} 
                  animate={true} 
                  className="justify-between gap-10 !bg-gray-400  border-gray-200 relative"
                >
                  {/* Logo Section */}
                  <div className="mb-6">
                    <Link href="/" className={cn(
                      "flex items-center group",
                      (sidebarOpen || sidebarLocked) ? "gap-2" : "justify-center"
                    )}>
                      
                      {(sidebarOpen || sidebarLocked) && (
                        <div className="flex flex-col mt-20 ms-4">
                          <h2 className="text-lg font-bold text-foreground">Centro de Energía Celsia</h2>
                          <p className="text-sm text-muted-foreground text-gray-800">Gestión Energética Inteligente</p>
                        </div>
                      )}
                    </Link>
                  </div>
                  

                  <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="flex flex-col gap-1">
                      {sidebarLinks.map((link, idx) => (
                        <SidebarLink
                          key={idx}
                          link={link}
                          open={sidebarOpen || sidebarLocked}
                          animate={true}
                          onClick={() => !sidebarLocked && setSidebarOpen(false)}
                        />
                      ))}
                    </div>
                  </div>

              {/* Bottom */}
              <div className="mt-auto px-2 py-2 w-full">
                <ThemeSwitcher open={sidebarOpen} />
                <UserMenu sidebarOpen={sidebarOpen} />
              </div>

            </SidebarBody>
          </Sidebar>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 w-full min-h-screen bg-background relative z-20 overflow-x-hidden">
        
        {/* Navbar */}
        <TopNavbar />

        {/* Content */}
        <div className={!isAuthPage ? "pt-16" : ""}>
  {children}
</div>

      </div>

      <Toaster />
    </div>
  );
}