"use client";

import { useState, useEffect } from "react";
import ResumenEstadoServicio from "@/components/dashboard/ResumenEstadoServicio";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function mapaCortesPage() {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const fromDashboard = sessionStorage.getItem("fromDashboard") === "true";
    setShowBackButton(fromDashboard);

    return () => {
      if (fromDashboard) {
        sessionStorage.removeItem("fromDashboard");
      }
    };
  }, []);

  const handleBackToDashboard = () => {
    sessionStorage.removeItem("fromDashboard");

    // 🔥 CAMBIO IMPORTANTE
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-100 w-full">
      <main className="container mx-auto px-2 py-8 pt-0 md:pt-8 w-full max-w-full ms-4">

        {showBackButton && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-700">
              Estado de tu servicio eléctrico
            </h1>
            <p className="text-neutral-700 text-slate-600 mt-4">
              Información en tiempo real para tu cuenta vinculada.
            </p>
          </div>
        </div>

      </main>

      <ResumenEstadoServicio />

    </div>
  );
}