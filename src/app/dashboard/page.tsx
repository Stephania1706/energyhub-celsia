"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Target,
} from "lucide-react";
import ReactECharts from "echarts-for-react";

export default function DashboardPage() {

  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setLocalUser(JSON.parse(data));
    }
  }, []);

  const consumo = 1247;
  const anterior = 1156;
  const meta = 1100;
  const eficiencia = 87.5;
  const ahorro = 156000;

  const variacion = ((consumo - anterior) / anterior) * 100;
  const progresoMeta = (consumo / meta) * 100;

  const insight =
    variacion > 0
      ? "Tu consumo aumentó este mes, principalmente en horario nocturno."
      : "Vas por buen camino, estás optimizando tu consumo energético.";

  const chartOption = {
    tooltip: {},
    xAxis: {
      type: "category",
      data: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [45, 52, 48, 60, 70, 55, 62],
        type: "bar",
        itemStyle: {
          color: "#F4A759",
          borderRadius: [6, 6, 0, 0],
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-gray-100 to-white p-6 text-slate-900 space-y-6">

      <div>
        <h1 className="text-4xl font-extrabold text-slate-700">
          Bienvenido, <span className="text-orange-500">{localUser?.nombre || "Invitado"} 👋</span>
        </h1>
        <p className="text-muted-foreground text-slate-400 mt-4">
          Supervisa y optimiza tu consumo energético en tiempo real.
        </p>
      </div>

      <Card className="overflow-hidden border-t-4 border-orange-200 rounded-3xl">
        <div className=" bg-gradient-to-r from-orange-50 via-white to-white p-5">
          <h2 className="text-xl font-bold mb-2">
            Plataforma de gestión energética
          </h2>

          <p className="text-sm text-slate-600 mb-4">
            Monitorea tu consumo, identifica oportunidades de ahorro y toma decisiones informadas.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-white p-3 rounded-xl border border-slate-200">📊 Visualiza tu consumo</div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">⚡ Detecta oportunidades de ahorro</div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">📈 Analiza tendencias</div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">💡 Recomendaciones inteligentes</div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">🧮 Simulación de tarifas</div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">⚙️ Estado del servicio</div>
          </div>
        </div>
      </Card>

      <Card className="bg-orange-50 border-orange-200 p-4 rounded-3xl">
        <p className="text-sm font-semibold text-orange-600">⚡ {insight}</p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <Card className="p-4 rounded-3xl border-gray-300">
          <p className="text-sm text-slate-500">Consumo actual</p>
          <p className="text-2xl font-bold">{consumo} kWh</p>
        </Card>

        <Card className="p-4 rounded-3xl border-gray-300">
          <p className="text-sm text-slate-500">Variación</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{variacion.toFixed(1)}%</p>
            {variacion > 0 ? <TrendingUp className="text-orange-500" /> : <TrendingDown className="text-green-500" />}
          </div>
        </Card>

        <Card className="p-4 rounded-3xl border-gray-300">
          <p className="text-sm text-slate-500">Eficiencia</p>
          <p className="text-2xl font-bold">{eficiencia}%</p>
        </Card>

        <Card className="p-4 rounded-3xl border-gray-300">
          <p className="text-sm text-slate-500">Ahorro estimado</p>
          <p className="text-2xl font-bold">${ahorro.toLocaleString("es-CO")}</p>
        </Card>
      </div>

      <Card className="p-5 border border-orange-200 rounded-3xl ">
        <div className="flex items-center gap-2 mb-2">
          <Target className="text-orange-500" />
          <p className="font-semibold">Meta de consumo mensual</p>
        </div>

        <p className="text-sm text-slate-500 mb-3">
          Meta: {meta} kWh | Actual: {consumo} kWh
        </p>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${progresoMeta > 100 ? "bg-red-300" : "bg-orange-400"}`}
            style={{ width: `${Math.min(progresoMeta, 100)}%` }}
          />
        </div>
      </Card>

      <Card className="overflow-hidden rounded-3xl">
        <div className="bg-gradient-to-r from-orange-50 via-white to-white p-5">
          <h2 className="text-lg font-semibold mb-4">Consumo semanal</h2>
          <div className="h-72">
            <ReactECharts option={chartOption} style={{ height: "100%" }} />
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-orange-50 border-orange-200 rounded-3xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            <p className="font-semibold">Alerta</p>
          </div>
          <p className="text-sm mt-2 text-slate-600">
            Alto consumo detectado en horas nocturnas.
          </p>
        </Card>

        <Card className="p-4 bg-emerald-50 border-emerald-200 rounded-3xl">
          <div className="flex items-center gap-2">
            <Zap className="text-green-500" />
            <p className="font-semibold">Recomendación</p>
          </div>
          <p className="text-sm mt-2 text-slate-600">
            Reduce consumo en horas pico para ahorrar hasta un 15%.
          </p>
        </Card>
      </div>

      {/* 🔥 CAMBIO IMPORTANTE */}
      <div className="flex gap-3">
        <button onClick={() => window.location.href = "reporte/"} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600">
          Ver informe completo
        </button>

        <button onClick={() => window.location.href = "simulador-tarifas/"} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200">
          Simular tarifa
        </button>
      </div>

    </div>
  );
}