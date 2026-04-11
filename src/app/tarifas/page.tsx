"use client";

import TarifaEducation from "@/components/dashboard/TarifaEducation";
import TarifaNueva from "@/components/dashboard/TarifaNueva";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function TarifasPage() {
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const fromDashboard = sessionStorage.getItem('fromDashboard');
    if (fromDashboard === 'true') {
      setShowBackButton(true);
      sessionStorage.removeItem('fromDashboard');
    }
  }, []);

  const handleBackToDashboard = () => {
    // 🔥 CAMBIO CLAVE
    window.location.href = "/energyhub-celsia/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
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
              Tarifas de Energía
            </h1>
            <p className="text-neutral-700 text-slate-600">
              A continuación te mostraremos los conceptos de tu Tarifa de energía.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <TarifaNueva />
        </div>

        <TarifaEducation />

      </main>
    </div>
  );
}