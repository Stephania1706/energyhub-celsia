"use client";
import React, { useMemo, useState } from "react";
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Zap, Calendar, Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

// COPIA — NO modifica la versión original.
// Vista: Arriba (Tendencia + Detalle). Abajo (Donut + tabla alineada tipo "grid").

function formatCOP(value: number) {
try {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
} catch {
    return `$${Math.round(value).toLocaleString("es-CO")}`;
}
}

function monthLabel(d: Date) {
    const m = d.toLocaleString("es-CO", { month: "short" });
    const y = d.getFullYear().toString().slice(-2);
    return `${m} ${y}`.replace(".", "");
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

type TariffPoint = {
    idx: number;
    date: string;
    label: string;
    cuTotal: number;
    g: number;
    t: number;
    d: number;
    c: number;
    p: number;
    r: number;
    o: number;
    reason: string;
    deltaPct: number;
};

function balanceOtros(total: number, comps: Record<string, number>) {
    const keys = Object.keys(comps);
    let sum = 0;
    for (const k of keys) sum += comps[k];

    let otros = total - sum;

    if (otros < 0) {
    // Por redondeo: ajustar el componente mayor (usualmente G)
    const sorted = keys.slice().sort((a, b) => (comps[b] ?? 0) - (comps[a] ?? 0));
    let deficit = Math.abs(otros);
    for (const k of sorted) {
        if (deficit <= 0) break;
            const take = Math.min(deficit, comps[k]);
        comps[k] -= take;
        deficit -= take;
    }
    otros = 0;
}

    return Math.max(0, Math.round(otros));
}

function generate24Months(): TariffPoint[] {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    const base = 820;
    const points: TariffPoint[] = [];

    const reasons = [
    "Revisión de componentes del CU",
    "Indexación del periodo",
    "Ajuste en costos del mercado",
    "Actualización de componentes regulados",
];

    for (let i = 23; i >= 0; i--) {
    const d0 = new Date(start.getFullYear(), start.getMonth() - i, 1);
    const wave = Math.sin((23 - i) / 2.4) * 22;
    const drift = (23 - i) * 3.2;
    const noise = ((23 - i) % 3 - 1) * 7;

    const cuTotal = Math.max(620, base + wave + drift + noise);

    const g = Math.round(cuTotal * 0.5);
    const t = Math.round(cuTotal * 0.06);
    const d = Math.round(cuTotal * 0.18);
    const c = Math.round(cuTotal * 0.16);
    const p = Math.round(cuTotal * 0.06);
    const r = Math.round(cuTotal * 0.02);

    const comps: Record<string, number> = { g, t, d, c, p, r };
    const o = balanceOtros(Math.round(cuTotal), comps);

    const prev = points.length ? points[points.length - 1].cuTotal : cuTotal;
    const deltaPct = prev ? ((cuTotal - prev) / prev) * 100 : 0;

    points.push({
        idx: points.length,
        date: d0.toISOString(),
        label: monthLabel(d0),
        cuTotal: Math.round(cuTotal),
        g: comps.g,
        t: comps.t,
        d: comps.d,
        c: comps.c,
        p: comps.p,
        r: comps.r,
        o,
        reason: reasons[(23 - i) % reasons.length],
      deltaPct: Math.round(deltaPct * 10) / 10,
    });
}

    return points;
}

const COLORS = {
    g: "#2563eb",
    t: "#f97316",
    d: "#16a34a",
    c: "#06b6d4",
    p: "#7c3aed",
    r: "#0f172a",
    o: "#a16207",
    total: "#94a3b8",
} as const;

const MOTIVOS: Record<string, string> = {
    g: "Variación del precio de compra (bolsa/contratos)",
    t: "Indexación regulatoria del componente",
    d: "Indexación y ajustes del Operador de Red",
    c: "Ajuste del componente de comercialización",
    p: "Variación de pérdidas reconocidas (mes a mes)",
    r: "Cargos por restricciones del sistema",
    o: "Cargos complementarios del periodo",
    total: "Variación total del CU",
};

function pct(part: number, total: number) {
    if (!total) return 0;
    return (part / total) * 100;
}

function DeltaPill({ deltaPct }: { deltaPct: number }) {
    const kind = deltaPct > 0.2 ? "up" : deltaPct < -0.2 ? "down" : "flat";
    const Icon = kind === "up" ? TrendingUp : kind === "down" ? TrendingDown : Minus;

    const cls =
    kind === "up"
        ? "bg-red-50 text-red-700 ring-red-200"
        : kind === "down"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-slate-50 text-slate-700 ring-slate-200";

return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ring-1 ${cls}`}>
        <Icon className="h-3.5 w-3.5" />
        {deltaPct > 0 ? "+" : ""}
        {Math.abs(deltaPct).toFixed(1)}%
    </span>
);
}

function MiniRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 py-1">
        <div className="text-sm text-slate-600">{label}</div>
        <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
    );
}

function DonutCenter({ total }: { total: number }) {
    return (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-xs text-slate-500">CU estimado</div>
            <div className="text-lg font-bold text-slate-900">{formatCOP(total)} / kWh</div>
    </div>
    );
}

function DonutLabel(props: any) {
    const { cx, cy, midAngle, outerRadius, percent, name } = props;
    const RADIAN = Math.PI / 180;
    if (percent < 0.01) return null;

    const r = outerRadius + 20;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);

  const pctText = `${(percent * 100).toFixed(2)}%`;

    const yOffsetMap: Record<string, number> = {
    Otros: -12,
    Restricciones: 12,
    "Pérdidas": 26,
    };
    const yAdj = y + (yOffsetMap[name] ?? 0);

    return (
    <text
        x={x}
        y={yAdj}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{
        fontSize: 12,
        fill: "#0f172a",
        stroke: "#ffffff",
        strokeWidth: 4,
        paintOrder: "stroke",
        }}
    >
        <tspan x={x} dy={-6}>
        {name}
        </tspan>
        <tspan x={x} dy={14} style={{ fontSize: 11 }}>
        {pctText}
        </tspan>
    </text>
    );
}

const DESC: Record<string, string> = {
    g: "Costo de producir/comprar la energía.",
    d: "Redes locales que te entregan la energía.",
    c: "Servicio de compra, medición y factura.",
    p: "Pérdidas reconocidas en el sistema.",
    t: "Peaje por autopistas eléctricas (alta tensión).",
    r: "Cargos por restricciones del sistema.",
    o: "Cargos complementarios del sistema.",
};

function BreakdownList({
    rows,
    total,
}: {
    rows: { k: string; name: string; v: number; color: string }[];
    total: number;
}) {
  // Mantener orden similar al ejemplo (más entendible): G, D, C, P, T, R, O
    const order = ["g", "d", "c", "p", "t", "r", "o"];
        const sorted = rows
    .slice()
    .sort((a, b) => order.indexOf(a.k) - order.indexOf(b.k));

    return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 h-[380px] flex flex-col">
        <div className="flex items-start justify-between gap-3">
        <div>
            <div className="text-sm font-semibold text-slate-900">Así se reparte tu CU</div>
            <div className="mt-1 text-xs text-slate-600">Participación por componente (con valor en COP/kWh).</div>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            participación
        </span>
    </div>

      {/* Lista con scroll interno */}
    <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-3">
        {sorted.map((x) => {
            const part = pct(x.v, total);
            return (
            <div key={x.k} className="rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                    <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: x.color }} />
                    <div className="truncate text-sm font-semibold text-slate-900">{x.name}</div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {part.toFixed(2)}%
                    </span>
                </div>
                    <div className="mt-1 text-sm text-slate-700">{DESC[x.k] ?? ""}</div>
                </div>

                <div className="shrink-0 text-right">
                    <div className="text-xs text-slate-500">COP/kWh</div>
                    <div className="text-lg font-bold text-slate-900">{formatCOP(x.v)}</div>
                </div>
            </div>

            <div className="mt-2 h-2 rounded-full bg-white ring-1 ring-slate-200 overflow-hidden">
                <div
                    className="h-full"
                    style={{ width: `${Math.min(100, Math.max(0, part))}%`, background: x.color }}
                />
                </div>
            </div>
            );
        })}
        </div>
    </div>
);
}

function AlignedRow({
    color,
    label,
    part,
    delta,
    motivo,
}: {
    color: string;
    label: string;
    part: number;
    delta: number;
    motivo: string;
}) {
    return (
        <div className="px-4 py-3 hover:bg-slate-50/70">
        <div className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-12 md:col-span-3 flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            <div className="truncate text-sm font-semibold text-slate-800">{label}</div>
        </div>

        <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-12 sm:col-span-2">
                <div className="w-[78px] rounded-full bg-white px-2 py-0.5 text-center text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {part.toFixed(2)}%
                </div>
            </div>
            <div className="col-span-12 sm:col-span-2">
                <div className="w-[86px]">
                <DeltaPill deltaPct={delta} />
                </div>
            </div>
            <div className="col-span-12 sm:col-span-8 min-w-0">
                <div
                className="text-xs text-slate-500"
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            > 
                {motivo}
                </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    );
}

export default function TarifaNueva() {
    const data = useMemo(() => generate24Months(), []);
    const [selectedIdx, setSelectedIdx] = useState<number>(data.length - 1);

    const selected = data[clamp(selectedIdx, 0, data.length - 1)];
    const prev = data[clamp(selectedIdx - 1, 0, data.length - 1)];

    const total = selected.cuTotal;

    const rows = [
    { k: "g", name: "Generación (G)", short: "Generación", v: selected.g, pv: prev.g, color: COLORS.g },
    { k: "t", name: "Transmisión (T)", short: "Transmisión", v: selected.t, pv: prev.t, color: COLORS.t },
    { k: "d", name: "Distribución (D)", short: "Distribución", v: selected.d, pv: prev.d, color: COLORS.d },
    { k: "c", name: "Comercialización (C)", short: "Comercialización", v: selected.c, pv: prev.c, color: COLORS.c },
    { k: "p", name: "Pérdidas (P)", short: "Pérdidas", v: selected.p, pv: prev.p, color: COLORS.p },
    { k: "r", name: "Restricciones (R)", short: "Restricciones", v: selected.r, pv: prev.r, color: COLORS.r },
    { k: "o", name: "Otros", short: "Otros", v: selected.o, pv: prev.o, color: COLORS.o },
    ];

    const donutData = rows.map((x) => ({ name: x.short, value: x.v, fill: x.color }));

return (
    <div className="w-full">
        <div className="mx-auto w-full">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
            <div className="flex items-center gap-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/70">
                <Zap className="h-5 w-5" />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-orange-400">Tarifa (CU) — últimos 24 meses</h1>
                </div>
            <p className="mt-1 text-sm text-slate-600">
                Selecciona un mes para ver el detalle del Costo Unitario (CU) y el motivo del cambio.
            </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
            <Calendar className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-semibold text-slate-800">{selected.label}</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 h-full">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-t-4 border-orange-200">
                <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Tendencia CU (COP/kWh)</div>
                    <div className="mt-1 text-xs text-slate-600">
                    Vista compacta para comparar dos años sin salir de esta pantalla.
                    </div>
                </div>
                <DeltaPill deltaPct={selected.deltaPct} />
                </div>

            <div className="mt-3 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                    data={data}
                    margin={{ top: 10, right: 12, left: 4, bottom: 0 }}
                    onMouseMove={(state: any) => {
                        if (state?.activePayload?.length) {
                        const idx = state.activePayload[0].payload.idx;
                        if (typeof idx === "number") setSelectedIdx(idx);
                    }
                    }}
                >
                    <defs>
                        <linearGradient id="cuFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.16} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={3} tickMargin={10} />
                    <YAxis
                        tick={{ fontSize: 11 }}
                        width={42}
                        tickFormatter={(v) => `${Math.round(v)}`}
                        domain={["dataMin - 40", "dataMax + 40"]}
                    />
                    <Tooltip
                        formatter={(v: any, name: any) =>
                        typeof v === "number" ? [formatCOP(v), name] : [v, name]
                        }
                        contentStyle={{
                        borderRadius: 14,
                        border: "1px solid rgba(253, 186, 116, 0.9)",
                        boxShadow: "0 10px 30px rgba(15,23,42,.08)",
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="cuTotal"
                        name="CU total"
                        stroke="#f97316"
                        fill="url(#cuFill)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5, stroke: "#ea580c", strokeWidth: 2, fill: "#fff" }}
                    />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-orange-50/40 px-3 py-2 ring-1 ring-orange-200/70">
                <div className="text-xs text-slate-600">
                    Tip: pasa el mouse por el gráfico para cambiar de mes (sin botones).
                </div>
                <div className="text-xs font-semibold text-slate-800">
                        CU seleccionado: <span className="text-orange-700">{formatCOP(selected.cuTotal)}</span> / kWh
                </div>
                </div>
            </div>
            </div>

    <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-t-4 border-orange-200">
                <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Detalle del mes</div>
                    <div className="mt-1 text-xs text-slate-600">Componentes del CU (simulado)</div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    <Info className="h-3.5 w-3.5 text-orange-600" />
                    {selected.label}
                </div>
            </div>

            <div className="mt-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <MiniRow label="CU total" value={`${formatCOP(selected.cuTotal)} / kWh`} />
                <div className="my-2 h-px bg-slate-200" />
                <MiniRow label="Generación (G)" value={formatCOP(selected.g)} />
                <MiniRow label="Transmisión (T)" value={formatCOP(selected.t)} />
                <MiniRow label="Distribución (D)" value={formatCOP(selected.d)} />
                <MiniRow label="Comercialización (C)" value={formatCOP(selected.c)} />
                <MiniRow label="Pérdidas (P)" value={formatCOP(selected.p)} />
                <MiniRow label="Restricciones (R)" value={formatCOP(selected.r)} />
                <MiniRow label="Otros" value={formatCOP(selected.o)} />
            </div>

            <div className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-orange-200/70">
                <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-700">Crecimiento y motivo</div>
                    <DeltaPill deltaPct={selected.deltaPct} />
                </div>
                <div className="mt-2 text-sm text-slate-800">
                    <span className="font-semibold text-orange-700">Motivo:</span> {selected.reason}
                </div>
                <div className="mt-2 text-xs text-slate-600">
                    Comparación vs. mes anterior ({prev.label}): {formatCOP(prev.cuTotal)} / kWh
                </div>
                </div>
            </div>
        </div>

        <div className="col-span-12">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-t-4 border-orange-200">
                <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">Composición del CU</div>
                    <div className="mt-1 text-xs text-slate-600">
                    Participación por componente y explicación del cambio del mes.
                </div>
                </div>
                <div className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {selected.label}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-5">
                    <div className="relative h-[380px] rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 overflow-visible">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 26, right: 90, bottom: 26, left: 90 }}>
                        <Pie
                            data={donutData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={86}
                            outerRadius={125}
                            paddingAngle={2}
                            labelLine={false}
                            label={DonutLabel}
                        >
                            {donutData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(v: any, name: any) => [formatCOP(v), name]}
                            contentStyle={{
                            borderRadius: 14,
                            border: "1px solid rgba(253, 186, 116, 0.9)",
                            boxShadow: "0 10px 30px rgba(15,23,42,.08)",
                        }}
                        />
                        </PieChart>
                    </ResponsiveContainer>
                    <DonutCenter total={total} />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-7">
                        <BreakdownList rows={rows} total={total} />
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="mt-3 text-xs text-slate-500">Nota: valores simulados para diseño.</div>
        </div>
    </div>
);
}
