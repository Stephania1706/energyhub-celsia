"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getCelsiaLogoUrl } from "@/lib/url-utils";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [contractId, setContractId] = useState("");

  const handleLogin = () => {
    if (!nombre || !contractId) return;

    const user = {
      nombre,
      contractId,
      ubicacion: {
        address: "",
        lat: 0,
        lng: 0,
      },
    };

    // guardar en navegador
    localStorage.setItem("user", JSON.stringify(user));

    // redirigir (compatible con GitHub Pages)
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 relative overflow-hidden">

      {/* Glow corporativo */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] 
      bg-orange-400/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] 
      bg-blue-400/10 rounded-full blur-3xl"></div>

      <Card className="p-8 w-full max-w-md text-center space-y-6 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl">

        {/* Logo */}
        <Image
          src={getCelsiaLogoUrl()}
          alt="Celsia"
          width={90}
          height={90}
          className="mx-auto"
        />

        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Centro de Energía Celsia
          </h1>

          <p className="text-orange-500 font-semibold mt-1">
            Plataforma para PYMES
          </p>
        </div>

        {/* Descripción */}
        <p className="text-sm text-slate-500">
          Gestiona el consumo energético de tu empresa,
          consulta tarifas y toma decisiones inteligentes.
        </p>

        {/* Formulario */}
        <div className="space-y-3">

          <Input
            placeholder="Nombre de la empresa o usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <Input
            placeholder="Número de contrato"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
          />

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handleLogin}
          >
            Ingresar al Portal PYME
          </Button>

        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400">
          Soluciones energéticas inteligentes para pequeñas y medianas empresas
        </p>

      </Card>
    </div>
  );
}