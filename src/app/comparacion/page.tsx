"use client";

import { useState, useEffect } from "react";
import ComparacionServicio from "@/components/dashboard/ComparacionServicio";

export default function ComparacionPage() {

  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setLocalUser(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <main className="container mx-auto px-8 py-8 pt-0 md:pt-8 w-full max-w-full">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight text-slate-700 mb-3">
                Comparación entre sedes
              </h1>
              <p className="text-neutral-700 text-slate-500">
                Compara el desempeño energético entre sedes y detecta oportunidades de mejora.
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 gap-6">
          <div className="w-full space-y-5">
            <ComparacionServicio />
          </div>
        </div>

      </main>
    </div>
  );
}