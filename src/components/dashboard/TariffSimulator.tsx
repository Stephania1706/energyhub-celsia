"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Info,
  RotateCcw,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Zap,
  Download,
} from "lucide-react";

// Mockup Web — 5.2.5 Simulación de tarifas flexibles u horarias
// Enfoque: simple, ejecutiva, sin tecnicismos; simulación de referencia (no reemplaza facturación real).

function formatCOP(value: number) {
  const sign = value < 0 ? "-" : "";
  const v = Math.abs(value);
  // Formato compacto (M / K) para lectura ejecutiva
  if (v >= 1_000_000) return `${sign}$ ${(v / 1_000_000).toFixed(2)} M`;
  if (v >= 1_000) return `${sign}$ ${(v / 1_000).toFixed(0)} K`;
  return `${sign}$ ${v.toFixed(0)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

type PeriodName = "Valle" | "Media" | "Pico";

type Tariff = {
  name: PeriodName;
  from: number; // inclusive hour
  to: number; // exclusive hour
  copPerKwh: number;
  tone: "slate" | "green" | "orange";
};

const DEFAULT_TARIFFS: Tariff[] = [
  { name: "Valle", from: 0, to: 6, copPerKwh: 540, tone: "green" },
  { name: "Media", from: 6, to: 18, copPerKwh: 650, tone: "slate" },
  { name: "Pico", from: 18, to: 24, copPerKwh: 850, tone: "orange" },
];

// Perfil horario ilustrativo (kWh por hora) para el mes seleccionado.
const DEFAULT_HOURLY: number[] = [
  110, 95, 90, 85, 90, 120, // 00–05
  180, 260, 320, 380, 420, 450, // 06–11
  470, 455, 430, 410, 395, 440, // 12–17
  500, 475, 350, 280, 200, 150, // 18–23
];

function getTariffForHour(hour: number, tariffs: Tariff[]) {
  return tariffs.find((t) => hour >= t.from && hour < t.to) || tariffs[0];
}

function redistributeEnergy(
  baseline: number[],
  tariffs: Tariff[],
  shiftPeakToValleyPct: number,
  shiftPeakToMidPct: number,
  reduceTotalPct: number
) {
  const base = baseline.slice();

  const peakHours = base.map((_, h) => h).filter((h) => getTariffForHour(h, tariffs).name === "Pico");
  const valleyHours = base.map((_, h) => h).filter((h) => getTariffForHour(h, tariffs).name === "Valle");
  const midHours = base.map((_, h) => h).filter((h) => getTariffForHour(h, tariffs).name === "Media");

  const peakEnergy = peakHours.reduce((acc, h) => acc + base[h], 0);
  const moveToValley = (peakEnergy * shiftPeakToValleyPct) / 100;
  const moveToMid = (peakEnergy * shiftPeakToMidPct) / 100;
  const totalMove = clamp(moveToValley + moveToMid, 0, peakEnergy * 0.75);

  // Remover energía del pico proporcionalmente
  if (peakEnergy > 0 && totalMove > 0) {
    for (const h of peakHours) {
      const share = base[h] / peakEnergy;
      base[h] = Math.max(0, base[h] - totalMove * share);
    }
  }

  // Repartir a valle y media uniformemente (simple y explicable)
  const valleyAdd = moveToValley;
  const midAdd = moveToMid;

  if (valleyHours.length > 0) {
    const per = valleyAdd / valleyHours.length;
    for (const h of valleyHours) base[h] += per;
  }
  if (midHours.length > 0) {
    const per = midAdd / midHours.length;
    for (const h of midHours) base[h] += per;
  }

  // Reducción total (eficiencia) aplicada proporcionalmente
  const reduceFactor = 1 - clamp(reduceTotalPct, 0, 20) / 100;
  for (let i = 0; i < base.length; i++) base[i] *= reduceFactor;

  return base;
}

function calcCost(hourlyKwh: number[], tariffs: Tariff[]) {
  return hourlyKwh.reduce((acc, kwh, h) => acc + kwh * getTariffForHour(h, tariffs).copPerKwh, 0);
}

function Card({
  title,
  icon,
  badge,
  children,
  className = "",
}: {
  title?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || badge) && (
        <div className="flex items-start justify-between gap-3 px-6 pt-6">
          <div className="flex items-start gap-3">
            {icon ? (
              <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-700 ring-1 ring-orange-100">
                {icon}
              </div>
            ) : null}
            {title ? (
              <div>
                <div className="text-sm font-medium text-slate-600">{title}</div>
              </div>
            ) : null}
          </div>
          {badge}
        </div>
      )}
      <div className="px-6 pb-6 pt-4">{children}</div>
    </div>
  );
}

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "orange" | "green" | "red";
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    orange: "bg-orange-50 text-orange-700 ring-orange-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

function MiniStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-slate-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-slate-600">{sub}</div> : null}
    </div>
  );
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
  step,
  suffix,
  helper,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{label}</div>
          {helper ? <div className="mt-0.5 text-xs text-slate-600">{helper}</div> : null}
        </div>
        <div className="text-sm font-bold text-slate-900">
          {value}
          {suffix}
        </div>
      </div>
      <input
        className="mt-3 w-full accent-orange-500"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

function BarPairChart({
  baseline,
  simulated,
}: {
  baseline: number[];
  simulated: number[];
}) {
  const maxV = Math.max(...baseline, ...simulated);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Perfil horario (comparación)</div>
          <div className="mt-0.5 text-xs text-slate-600">Misma energía total; cambia la distribución por hora.</div>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="slate">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-500" />
            Base
          </Pill>
          <Pill tone="orange">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
            Simulación
          </Pill>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[980px]">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
          >
            {baseline.map((b, i) => {
              const s = simulated[i];
              const hb = (b / maxV) * 120;
              const hs = (s / maxV) * 120;
              return (
                <div key={i} className="flex flex-col items-center justify-end">
                  <div className="relative h-[130px] w-full">
                    <div
                      className="absolute bottom-0 left-0 w-[46%] rounded-md bg-slate-200"
                      style={{ height: `${hb}px` }}
                      title={`Base ${round1(b)} kWh`}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-[46%] rounded-md bg-orange-200"
                      style={{ height: `${hs}px` }}
                      title={`Sim ${round1(s)} kWh`}
                    />
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-slate-600">{String(i).padStart(2, "0")}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-slate-500">Hora del día</div>
        </div>
      </div>
    </div>
  );
}

function TariffTable({
  tariffs,
  setTariffs,
}: {
  tariffs: Tariff[];
  setTariffs: (t: Tariff[]) => void;
}) {
  return (
    <div className="mt-4 grid gap-3">
      {tariffs.map((t, idx) => (
        <div key={t.name} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="min-w-[210px]">
            <div className="text-sm font-extrabold text-slate-900">{t.name}</div>
            <div className="mt-0.5 text-xs text-slate-600">
              Horario: {String(t.from).padStart(2, "0")}:00 – {String(t.to).padStart(2, "0")}:00
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">COP/kWh</span>
            <input
              className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none ring-orange-200 focus:ring-2"
              value={t.copPerKwh}
              onChange={(e) => {
                const v = Number(e.target.value || 0);
                const next = tariffs.slice();
                next[idx] = { ...t, copPerKwh: clamp(v, 0, 5000) };
                setTariffs(next);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MockupSimulacionTarifasHorarias() {
  const [period, setPeriod] = useState("Febrero 2026");
  const [scenario, setScenario] = useState<"Tarifa horaria" | "Tarifa plana">("Tarifa horaria");
  const [tariffs, setTariffs] = useState<Tariff[]>(DEFAULT_TARIFFS);

  // Controles del usuario (simulación)
  const [shiftPeakToValley, setShiftPeakToValley] = useState(20);
  const [shiftPeakToMid, setShiftPeakToMid] = useState(10);
  const [reduceTotal, setReduceTotal] = useState(0);

  const baselineHourly = useMemo(() => DEFAULT_HOURLY.slice(), []);

  const simulatedHourly = useMemo(() => {
    return redistributeEnergy(baselineHourly, tariffs, shiftPeakToValley, shiftPeakToMid, reduceTotal);
  }, [baselineHourly, tariffs, shiftPeakToValley, shiftPeakToMid, reduceTotal]);

  const baseKwh = useMemo(() => sum(baselineHourly), [baselineHourly]);
  const simKwh = useMemo(() => sum(simulatedHourly), [simulatedHourly]);

  // Costo base y simulado según escenario seleccionado
  const flatCopPerKwh = 633;

  const baseCost = useMemo(() => {
    if (scenario === "Tarifa plana") return baseKwh * flatCopPerKwh;
    return calcCost(baselineHourly, tariffs);
  }, [scenario, baseKwh, baselineHourly, tariffs]);

  const simCost = useMemo(() => {
    if (scenario === "Tarifa plana") return simKwh * flatCopPerKwh;
    return calcCost(simulatedHourly, tariffs);
  }, [scenario, simKwh, simulatedHourly, tariffs]);

  const delta = simCost - baseCost;
  const deltaPct = baseCost > 0 ? (delta / baseCost) * 100 : 0;

  const peakHours = useMemo(
    () => baselineHourly.map((_, h) => h).filter((h) => getTariffForHour(h, tariffs).name === "Pico"),
    [baselineHourly, tariffs]
  );
  const basePeak = useMemo(() => peakHours.reduce((acc, h) => acc + baselineHourly[h], 0), [peakHours, baselineHourly]);
  const simPeak = useMemo(() => peakHours.reduce((acc, h) => acc + simulatedHourly[h], 0), [peakHours, simulatedHourly]);

  const headline = useMemo(() => {
    if (scenario === "Tarifa plana") {
      return "Con tarifa plana, el costo cambia solo si baja tu consumo total.";
    }
    if (delta < 0) {
      return `Con este ajuste, tu costo estimado baja ${Math.abs(deltaPct).toFixed(1)}%.`;
    }
    if (delta > 0) {
      return `Con este ajuste, tu costo estimado sube ${Math.abs(deltaPct).toFixed(1)}%.`;
    }
    return "Con este ajuste, tu costo estimado se mantiene.";
  }, [scenario, delta, deltaPct]);

  function reset() {
    setScenario("Tarifa horaria");
    setTariffs(DEFAULT_TARIFFS);
    setShiftPeakToValley(20);
    setShiftPeakToMid(10);
    setReduceTotal(0);
  }

  function downloadPdfLike() {
    // En el navegador, esto permite “Guardar como PDF”.
    window.print();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="w-full  space-py-8">
        {/* Header */}
        <div className="rounded-[28px] border border-orange-100 bg-gradient-to-b from-orange-50 to-white p-6 shadow-sm border-t-4 border-orange-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 ">
              <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600">Funcionalidad 5.2.5</div>
                <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Simulación de tarifas horarias</div>
                <div className="mt-2 max-w-2xl text-sm text-slate-700">
                  Explora escenarios simples para entender cómo los cambios de horario pueden impactar el costo. Sin tecnicismos y con mensajes claros.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 ">
                  <Pill tone="orange">
                    <Zap className="h-3.5 w-3.5" />
                    Simulación rápida
                  </Pill>
                  <Pill tone="slate">
                    <Info className="h-3.5 w-3.5" />
                    Referencia (no es facturación)
                  </Pill>
                  <Pill tone={delta < 0 ? "green" : delta > 0 ? "red" : "slate"}>
                    {delta < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : delta > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {delta < 0 ? "Ahorro" : delta > 0 ? "Mayor costo" : "Sin cambio"}
                  </Pill>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  Periodo
                </div>
                <select
                  className="ml-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none ring-orange-200 focus:ring-2"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option>Febrero 2026</option>
                  <option>Enero 2026</option>
                  <option>Diciembre 2025</option>
                </select>
              </div>

              <button
                onClick={downloadPdfLike}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-orange-700"
              >
                <Download className="h-4 w-4" />
                Descargar (PDF)
              </button>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-5">
            <Card className="border-t-4 border-orange-200 text-xl"
              title="Ajusta tu escenario"
              icon={<SlidersHorizontal className="h-5 w-5" />}
              badge={
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restablecer
                </button>
              }
            >
              <div className="grid gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">Esquema evaluado</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setScenario("Tarifa horaria")}
                      className={`rounded-2xl px-4 py-3 text-sm font-extrabold ring-1 transition ${
                        scenario === "Tarifa horaria"
                          ? "bg-white text-slate-900 ring-orange-200"
                          : "bg-slate-50 text-slate-700 ring-slate-200 hover:bg-white"
                      }`}
                    >
                      Tarifa horaria
                      <div className="mt-1 text-xs font-medium text-slate-600">Valle / Media / Pico</div>
                    </button>
                    <button
                      onClick={() => setScenario("Tarifa plana")}
                      className={`rounded-2xl px-4 py-3 text-sm font-extrabold ring-1 transition ${
                        scenario === "Tarifa plana"
                          ? "bg-white text-slate-900 ring-orange-200"
                          : "bg-slate-50 text-slate-700 ring-slate-200 hover:bg-white"
                      }`}
                    >
                      Tarifa plana
                      <div className="mt-1 text-xs font-medium text-slate-600">Referencia CU</div>
                    </button>
                  </div>
                  {scenario === "Tarifa plana" ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">Valor de referencia</div>
                        <Pill tone="slate">{flatCopPerKwh} COP/kWh</Pill>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">En tarifa plana, mover consumo entre horas no cambia el costo. Solo cambia si bajas kWh totales.</div>
                    </div>
                  ) : null}
                </div>

                <Slider
                  label="Mover consumo desde horario pico a valle"
                  helper="Ejemplo: programar procesos o cargas no críticas más temprano."
                  value={shiftPeakToValley}
                  setValue={setShiftPeakToValley}
                  min={0}
                  max={40}
                  step={5}
                  suffix="%"
                />

                <Slider
                  label="Mover consumo desde horario pico a media"
                  helper="Útil si no puedes irte a valle, pero sí salir del pico."
                  value={shiftPeakToMid}
                  setValue={setShiftPeakToMid}
                  min={0}
                  max={40}
                  step={5}
                  suffix="%"
                />

                <Slider
                  label="Reducir consumo total (eficiencia)"
                  helper="Apaga equipos en stand-by, mejora hábitos y mantenimiento."
                  value={reduceTotal}
                  setValue={setReduceTotal}
                  min={0}
                  max={10}
                  step={1}
                  suffix="%"
                />
              </div>

              {scenario === "Tarifa horaria" ? (
                <div className="mt-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Tarifa horaria (editable)</div>
                        <div className="mt-0.5 text-xs text-slate-600">Ajusta valores COP/kWh para explorar escenarios.</div>
                      </div>
                      <Pill tone="slate">
                        <Info className="h-3.5 w-3.5" />
                        Referencia
                      </Pill>
                    </div>
                    <TariffTable tariffs={tariffs} setTariffs={setTariffs} />
                  </div>
                </div>
              ) : null}
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-7">
            <Card className="border-t-4 border-orange-200"
              title="Resultado del escenario"
              icon={<Zap className="h-5 w-5" />}
              badge={<Pill tone={delta < 0 ? "green" : delta > 0 ? "red" : "slate"}>{period}</Pill>} 
            >
              <div className="gap-4">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5">
                  <div className="text-2xl font-extrabold tracking-tight text-slate-900">{headline}</div>
                  <div className="mt-2 text-sm text-slate-700">
                    Lectura rápida: hoy estás moviendo <span className="font-bold">{shiftPeakToValley}%</span> del pico a valle y <span className="font-bold">{shiftPeakToMid}%</span> del pico a media.
                    {reduceTotal > 0 ? (
                      <> Además, estás reduciendo <span className="font-bold">{reduceTotal}%</span> del consumo total.</>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MiniStat label="Costo base" value={formatCOP(baseCost)} sub={scenario === "Tarifa horaria" ? "Con tu distribución actual" : "Tarifa plana"} />
                    <MiniStat label="Costo simulado" value={formatCOP(simCost)} sub={scenario === "Tarifa horaria" ? "Con el ajuste de horarios" : "Con reducción de kWh"} />
                    <MiniStat
                      label={delta < 0 ? "Ahorro estimado" : delta > 0 ? "Sobrecosto estimado" : "Diferencia"}
                      value={formatCOP(Math.abs(delta))}
                      sub={<span className="font-semibold">{Math.abs(deltaPct).toFixed(1)}%</span>}
                    />
                    <MiniStat label="Consumo en pico" value={`${round1(simPeak)} kWh`} sub={`Base: ${round1(basePeak)} kWh`} />
                  </div>
                </div>

                <BarPairChart baseline={baselineHourly} simulated={simulatedHourly} />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-900">Qué significa esto (en simple)</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-orange-500" />
                        <span>
                          Si mueves consumo del <span className="font-bold">pico</span> al <span className="font-bold">valle</span>, pagas menos por cada kWh en esas horas.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-slate-400" />
                        <span>
                          Si solo cambias horarios (sin bajar kWh), tu operación sigue igual; lo que cambia es el costo por franja.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-emerald-500" />
                        <span>
                          La reducción total (eficiencia) siempre ayuda, incluso con tarifa plana.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-extrabold text-slate-900">Acción sugerida</div>
                      <Pill tone="orange">
                        <Clock className="h-3.5 w-3.5" />
                        Rápida
                      </Pill>
                    </div>
                    <div className="mt-2 text-sm text-slate-800">
                      Empieza por una sola cosa: identifica <span className="font-bold">1 carga</span> que puedas mover del pico al valle (por ejemplo: bombeo, compresor, refrigeración auxiliar, lavado, cargadores).
                    </div>
                    <div className="mt-3 rounded-2xl border border-orange-200 bg-white p-3 text-sm text-slate-700">
                      Meta simple: reduce el pico en <span className="font-bold">10–20%</span> y revisa el impacto. Si la operación no se afecta, puedes ampliar el cambio.
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-600">Nota</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Simulación ilustrativa para comprensión. Valores de tarifa y perfil horario se ajustan con datos reales, reglas regulatorias y facturación del OR/Comercializador.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}




