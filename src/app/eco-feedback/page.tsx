"use client";

import { useState, useEffect } from "react";
import ResumenEcoFeed from "@/components/dashboard/ResumeEcoFeed";
import EcoFeedbackSystem from "@/components/dashboard/EcoFeedbackSystem";
import ConsumoFueraDeHorario from "@/components/dashboard/ConsumoFueraDeHorario";
import AnalisisAvanzado from "@/components/dashboard/AnalisisAvanzado";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EcoFeedbackPage() {
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

  const [tab, setTab] = useState("resumen");

  const handleBackToDashboard = () => {
    sessionStorage.removeItem("fromDashboard");

    // 🔥 CAMBIO CLAVE (ruta relativa)
    window.location.href = "dashboard/";
  };

  return (
    <div className="min-h-screen bg-slate-100 w-full">
      <main className="container px-2 py-8 pt-0 md:pt-8 w-full max-w-full">

        {showBackButton && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        )}

        <div className="ms-6">
          <div className="mb-4">
            <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight text-slate-700 mb-3">
              Informe de Energía
            </h1>
            <p className="text-muted-foreground text-slate-500">
              A continuación te mostraremos tu Informe de energía mensual.
            </p>
          </div>

          <div className="flex gap-2 mt-10 bg-slate-100 rounded-xl w-fit shadow-inner">

            <button onClick={() => setTab("resumen")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === "resumen" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-orange-500"}`}>
              Resumen
            </button>

            <button onClick={() => setTab("consumo")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === "consumo" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-orange-500"}`}>
              Consumo
            </button>

            <button onClick={() => setTab("fueraHorario")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === "fueraHorario" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-orange-500"}`}>
              Fuera de horario
            </button>

            <button onClick={() => setTab("avanzado")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === "avanzado" ? "bg-white text-orange-600 shadow-sm" : "text-slate-600 hover:text-orange-500"}`}>
              Análisis detallado
            </button>

          </div>
        </div>

        {tab === "resumen" && <ResumenEcoFeed />}
        {tab === "consumo" && <EcoFeedbackSystem />}
        {tab === "fueraHorario" && <ConsumoFueraDeHorario />}
        {tab === "avanzado" && <AnalisisAvanzado />}

      </main>
    </div>
  );
}