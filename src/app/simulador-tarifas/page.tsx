"use client";

import { useState, useEffect } from "react";
import TariffSimulator from "@/components/dashboard/TariffSimulator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SimuladorTarifasPage() {
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

    // 🔥 CAMBIO CLAVE
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-100 w-full">
      <main className="container mx-auto px-8 py-8 pt-4 md:pt-8 w-full max-w-full">

        <div className="mb-6">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={handleBackToDashboard}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          )}

          <div className="mb-4">
            <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight text-slate-700 mb-3">
              Simulación de Tarifas Flexibles
            </h1>
            <p className="text-muted-foreground text-slate-400">
              Explora diferentes escenarios tarifarios y visualiza su impacto en tus costos energéticos
            </p>
          </div>
        </div>

        <TariffSimulator />

      </main>
    </div>
  );
}