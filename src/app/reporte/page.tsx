"use client";

import { useState, useEffect } from "react";
import ComparacionServicio from "@/components/dashboard/ComparacionServicio";
import ReporteEjecutivo from "@/components/dashboard/ReporteEjecutivo";

export default function DashboardPage() {

  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setLocalUser(JSON.parse(data));
    }
  }, []);

  const user = localUser;

  const handleExportCSV = () => {
    if (!user) {
      alert("No hay información de usuario disponible");
      return;
    }

    const csvRows: string[] = [];

    csvRows.push("RESUMEN EJECUTIVO - DATOS DEL USUARIO");
    csvRows.push("");
    csvRows.push(`Nombre,${user.nombre || "N/A"}`);
    csvRows.push(`ID de Contrato,${user.contractId || "N/A"}`);
    csvRows.push(`Dirección,${user.ubicacion?.address || "N/A"}`);
    csvRows.push(`Fecha de Exportación,${new Date().toLocaleString("es-CO")}`);
    csvRows.push("");

    const BOM = "\uFEFF";
    const csvContent = BOM + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "datos_energia.csv";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <main className="container mx-auto px-8 py-8 pt-0 md:pt-8 w-full max-w-full">

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">

              <div className="mb-4">
                <p className="text-base sm:text-xl font-bold text-slate-700">
                  Bienvenido a tu reporte ⚡
                </p>
                <p className="text-sm text-neutral-600 mt-2">
                  En cada kilovatio hay una historia de energía que impulsa tu negocio.
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                    Estamos aquí para acompañarte, ayudarte a optimizar tu consumo y brindarte soluciones que hagan tu operación más eficiente y sostenible.
                    </p>
              </div>

              <h1 className="text-4xl font-extrabold text-slate-700 mb-3 mt-10">
                Reporte ejecutivo
              </h1>
              <p className="text-neutral-700 text-slate-600">
                    Monitorea tu consumo, recibe alertas inteligentes y optimiza tu gasto energético en tiempo real.
                </p>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="w-full space-y-5">
            <ReporteEjecutivo />
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Descargar CSV
        </button>

      </main>
    </div>
  );
}