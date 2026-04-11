import React, { useMemo, useState } from "react";
import {
    BarChart3,
    Calendar,
    Check,
    ChevronDown,
    Leaf,
    LineChart,
    Moon,
    Sparkles,
    Sun,
    Target,
    Trees,
    } from "lucide-react";
    import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    } from "recharts";

    // -----------------------------
    // Shared UI
    // -----------------------------

    function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</div>;
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
        green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        red: "bg-red-50 text-red-700 ring-red-200",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{children}</span>
    );
    }

    function Segmented({
    value,
    onChange,
    items,
    }: {
    value: string;
    onChange: (v: string) => void;
    items: { key: string; label: string }[];
    }) {
    return (
        <div className="inline-flex rounded-2xl bg-slate-50 p-1 ring-1 ring-slate-200">
        {items.map((it) => (
            <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition " +
                (value === it.key ? "bg-white text-slate-900 ring-1 ring-slate-200" : "text-slate-600 hover:text-slate-900")
            }
            >
            {it.label}
            </button>
        ))}
        </div>
    );
    }

    function fmt(n: number) {
    try {
        return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(Math.round(n));
    } catch {
        return String(Math.round(n));
    }
    }

    const COLORS = {
    orange: "rgba(249, 115, 22, 0.85)",
    orangeSoft: "rgba(249, 115, 22, 0.25)",
    green: "rgba(34, 197, 94, 0.85)",
    greenSoft: "rgba(34, 197, 94, 0.22)",
    slate: "rgba(148, 163, 184, 0.90)",
    slateSoft: "rgba(148, 163, 184, 0.22)",
    };

    function SimpleTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const p = payload[0];
    return (
        <div className="rounded-2xl bg-white p-3 shadow-lg ring-1 ring-slate-200">
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className="mt-1 text-sm font-bold text-slate-900">{fmt(p.value)} kWh</div>
        </div>
    );
    }

    function KpiChip({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
    return (
        <div className="rounded-3xl bg-orange-50/40 p-4 ring-1 ring-orange-200/70">
        <div className="text-[11px] font-semibold text-orange-700">{title}</div>
        <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-600">{subtitle}</div>
        </div>
    );
    }

    // -----------------------------
    // Gadget 1 — Consumo mensual por categoría
    // -----------------------------

    function GadgetConsumoMensualCategoria() {
    const [compareOn, setCompareOn] = useState(true);
    const [highlight, setHighlight] = useState("Ambos");
    const [invertOrder, setInvertOrder] = useState(false);

    const avg = 4281;

    const data = useMemo(() => {
        const months = [
        { m: "Ene", v: 3850 },
        { m: "Feb", v: 4010 },
        { m: "Mar", v: 3350 },
        { m: "Abr", v: 3600 },
        { m: "May", v: 3720 },
        { m: "Jun", v: 3980 },
        { m: "Jul", v: 6100 },
        { m: "Ago", v: 5750 },
        { m: "Sep", v: 4450 },
        { m: "Oct", v: 4120 },
        { m: "Nov", v: 3890 },
        { m: "Dic", v: 3800 },
        ];

        // Clasificación: 3 más altos (alto), 3 más bajos (ahorro), resto normal
        const sorted = [...months].sort((a, b) => a.v - b.v);
        const low = new Set(sorted.slice(0, 3).map((x) => x.m));
        const high = new Set(sorted.slice(-3).map((x) => x.m));

        const comp = {
        Ene: 4100,
        Feb: 4200,
        Mar: 3500,
        Abr: 3700,
        May: 3900,
        Jun: 4050,
        Jul: 5900,
        Ago: 5600,
        Sep: 4700,
        Oct: 4300,
        Nov: 4100,
        Dic: 3950,
        } as Record<string, number>;

        return months.map((x) => {
        const category = high.has(x.m) ? "Alto" : low.has(x.m) ? "Ahorro" : "Normal";
        return {
            name: x.m,
            actual: x.v,
            compare: comp[x.m],
            category,
        };
        });
    }, []);

    const dataView = useMemo(() => (invertOrder ? [...data].reverse() : data), [data, invertOrder]);

    const colorByCategory = (cat: string) => {
        if (cat === "Ahorro") return COLORS.green;
        if (cat === "Alto") return COLORS.orange;
        return COLORS.slate;
    };

    const cellColor = (cat: string) => {
        if (highlight === "Ambos") return colorByCategory(cat);
        return cat === highlight ? colorByCategory(cat) : COLORS.slateSoft;
    };

    return (
        <div className="w-full p-6">
        <div className="w-full space-y-5">

            <Card className="w-full overflow-hidden border-t-4 border-orange-200 ">
            <div className="bg-gradient-to-r from-orange-50 via-white to-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">Consumo mensual por categoría</div>
                <div className="mt-1 text-sm font-semibold text-slate-600">Identifica meses de alto consumo y ahorro frente al promedio anual.</div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS.green }} />
                    Ahorro
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS.slate }} />
                    Normal
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS.orange }} />
                    Alto
                </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Pill tone="slate">
                <span className="inline-flex h-2.5 w-2.5 rounded" style={{ background: "rgba(37,99,235,0.75)" }} />
                Año Actual
                </Pill>
                <Pill tone="slate">
                <span className="inline-flex h-2.5 w-2.5 rounded" style={{ background: COLORS.slateSoft }} />
                Año Comparación
                </Pill>
                <button
                onClick={() => setHighlight("Ambos")}
                className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                Todo
                </button>
                <button
                onClick={() => setInvertOrder((v) => !v)}
                className={
                    "rounded-2xl px-3 py-2 text-xs font-semibold ring-1 ring-slate-200 transition " +
                    (invertOrder ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-50")
                }
                >
                Invertir
                </button>
            </div>
            </div>
        </div>

        <div className="bg-orange-50/20 px-5 pb-5 pt-4">
            <div className="rounded-3xl bg-white/70 p-4 ring-1 ring-slate-200">
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataView} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.35)" />
                    <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
                    <Tooltip content={<SimpleTooltip />} />
                    {compareOn ? (
                    <Bar dataKey="compare" radius={[10, 10, 0, 0]} fill={COLORS.slateSoft} />
                    ) : null}
                    <Bar dataKey="actual" radius={[10, 10, 0, 0]}>
                    {dataView.map((d, idx) => (
                        <Cell key={idx} fill={cellColor(d.category)} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <span className="text-xs font-semibold text-slate-600">Año Actual</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <button
                    onClick={() => setCompareOn((v) => !v)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full ring-1 ring-slate-200 transition ${compareOn ? "bg-orange-500/80" : "bg-slate-200"}`}
                    aria-label="toggle"
                >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition ${compareOn ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <span className="text-xs font-semibold text-slate-700">Año de Comparación</span>
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <span className="text-xs font-semibold text-slate-600">1er año</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>

                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <span className="text-xs font-semibold text-slate-600">Resaltar:</span>
                <select
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-800 outline-none"
                >
                    <option>Ambos</option>
                    <option>Ahorro</option>
                    <option>Alto</option>
                    <option>Normal</option>
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
            </div>

            <div className="mt-5">
                <div className="text-sm font-semibold text-slate-900">Promedio anual: {fmt(avg)} kWh</div>
                <div className="mt-1 text-sm text-slate-600">Los tres meses con mayor consumo se muestran en naranja y los de menor consumo en verde.</div>

                <div className="mt-4 rounded-3xl bg-emerald-50/70 p-4 ring-1 ring-emerald-200">
                <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/70">
                    <Leaf className="h-5 w-5" />
                    </div>
                    <div className="text-[13px] leading-relaxed text-slate-800">
                    <span className="font-semibold">Este mes consumiste 3.850 kWh</span>, un 6% menos que el mismo mes del año pasado.
                    <span className="font-semibold"> ¡Has reducido tu consumo en 7% y mejorado tu eficiencia!</span>
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* KPIs históricos (mini) */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <KpiChip title="MAYOR CONSUMO HISTÓRICO" value="6.700 kWh" subtitle="Jul 2023" />
            <KpiChip title="MENOR CONSUMO HISTÓRICO" value="3.420 kWh" subtitle="Mar 2025" />
            <KpiChip title="PROMEDIO 12 MESES" value="4.281 kWh/mes" subtitle="tendencia 3M a la baja" />
            </div>
        </div>
        </Card>
        </div>
        </div>
    );
    }

    // -----------------------------
    // Gadget 2 — Distribución por franja horaria
    // -----------------------------

    function GadgetDistribucionFranjaHoraria() {
    const [period, setPeriod] = useState("Mes");
    const [view, setView] = useState("Barras");

    const hours = useMemo(() => {
        // Objetivo (mockup) coherente con tu imagen: Mes = 71% valle, 9% media, 20% pico
        const baseTargets = { valle: 5150, media: 645, pico: 1460 };
        const mult = period === "Mes" ? 1 : period === "Trimestre" ? 3 : 12;
        const targets = {
        valle: baseTargets.valle * mult,
        media: baseTargets.media * mult,
        pico: baseTargets.pico * mult,
        };

        const scaleTo = (arr: number[], target: number) => {
        const sum = arr.reduce((s, v) => s + v, 0) || 1;
        const scaled = arr.map((v) => Math.round((v / sum) * target));
        const diff = target - scaled.reduce((s, v) => s + v, 0);
        scaled[scaled.length - 1] = Math.max(0, scaled[scaled.length - 1] + diff);
        return scaled;
        };

        // Perfiles por hora (forma visual) — luego se escalan para que los totales den exacto
        const mediaBase = [120, 95, 88, 82, 100, 160]; // 00–05 (verde)
        const valleBase = [220, 260, 310, 370, 410, 440, 460, 480, 470, 440, 410, 390, 410]; // 06–18 (gris)
        const picoBase = [480, 350, 280, 200, 150]; // 19–23 (naranja)

        const mediaScaled = scaleTo(mediaBase, targets.media);
        const valleScaled = scaleTo(valleBase, targets.valle);
        const picoScaled = scaleTo(picoBase, targets.pico);

        const out: { h: string; kwh: number; band: "valle" | "media" | "pico" }[] = [];

        // 00–05 (Tarifa media)
        for (let i = 0; i <= 5; i++) {
        out.push({
            h: `${String(i).padStart(2, "0")}:00`,
            kwh: Math.max(0, mediaScaled[i]),
            band: "media",
        });
        }

        // 06–18 (Valle)
        for (let i = 6; i <= 18; i++) {
        out.push({
            h: `${String(i).padStart(2, "0")}:00`,
            kwh: Math.max(0, valleScaled[i - 6]),
            band: "valle",
        });
        }

        // 19–23 (Pico)
        for (let i = 19; i <= 23; i++) {
        out.push({
            h: `${String(i).padStart(2, "0")}:00`,
            kwh: Math.max(0, picoScaled[i - 19]),
            band: "pico",
        });
        }

        return out;
    }, [period]);

    const totals = useMemo(() => {
        const sum = (band: string) => hours.filter((x) => x.band === band).reduce((s, x) => s + x.kwh, 0);
        const valle = sum("valle");
        const media = sum("media");
        const pico = sum("pico");
        const total = valle + media + pico;
        const pct = (n: number) => (total ? (n / total) * 100 : 0);
        return {
        valle,
        media,
        pico,
        total,
        vallePct: pct(valle),
        mediaPct: pct(media),
        picoPct: pct(pico),
        };
    }, [hours]);

    const pie = useMemo(
        () => [
        { name: "Valle", value: totals.valle, color: COLORS.slate },
        { name: "Tarifa media", value: totals.media, color: COLORS.green },
        { name: "Pico", value: totals.pico, color: COLORS.orange },
        ],
        [totals]
    );

    return (
        <Card className="overflow-hidden">
        <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
                <div className="text-xl font-bold text-slate-900">Distribución de consumo por franja horaria</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-slate-600">Periodo:</div>
                <Segmented
                    value={period}
                    onChange={setPeriod}
                    items={[
                    { key: "Mes", label: "Mes" },
                    { key: "Trimestre", label: "Trimestre" },
                    { key: "Año", label: "Año" },
                    ]}
                />
                </div>
            </div>

            <Segmented
                value={view}
                onChange={setView}
                items={[
                { key: "Barras", label: "Barras Horarias" },
                { key: "Circular", label: "Gráfico Circular" },
                ]}
            />
            </div>

            <div className="mt-4 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
            <div className="h-[280px] w-full">
                {view === "Barras" ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hours} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.35)" />
                    <XAxis dataKey="h" tick={{ fill: "#475569", fontSize: 11 }} interval={1} angle={-30} textAnchor="end" height={45} />
                    <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
                    <Tooltip content={<SimpleTooltip />} />
                    <Bar dataKey="kwh" radius={[10, 10, 0, 0]}>
                        {hours.map((d, idx) => (
                        <Cell
                            key={idx}
                            fill={
                            d.band === "media" ? COLORS.green : d.band === "pico" ? COLORS.orange : COLORS.slate
                            }
                        />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Tooltip
                        content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const p = payload[0];
                        return (
                            <div className="rounded-2xl bg-white p-3 shadow-lg ring-1 ring-slate-200">
                            <div className="text-xs font-semibold text-slate-500">{p.name}</div>
                            <div className="mt-1 text-sm font-bold text-slate-900">{fmt(p.value)} kWh</div>
                            </div>
                        );
                        }}
                    />
                    <Pie data={pie} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={3}>
                        {pie.map((p, idx) => (
                        <Cell key={idx} fill={p.color} />
                        ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
                )}
            </div>
            </div>

            <div className="mt-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="text-center text-sm font-semibold text-slate-600">Datos correspondientes al {period}</div>
            </div>

            <div className="mt-3 space-y-3">
            <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS.slate }} />
                    Valle: tarifa más baja
                </div>
                <div className="text-sm font-semibold text-slate-900">
                    {totals.vallePct.toFixed(0)}% <span className="text-slate-500 font-semibold">{fmt(totals.valle)} kWh</span>
                </div>
                </div>
            </div>

            <div className="rounded-3xl bg-emerald-50/55 p-4 ring-1 ring-emerald-200">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS.green }} />
                    Tarifa media
                </div>
                <div className="text-sm font-semibold text-slate-900">
                    {totals.mediaPct.toFixed(0)}% <span className="text-slate-500 font-semibold">{fmt(totals.media)} kWh</span>
                </div>
                </div>
            </div>

            <div className="rounded-3xl bg-orange-50/55 p-4 ring-1 ring-orange-200">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS.orange }} />
                    Pico: tarifa más alta
                </div>
                <div className="text-sm font-semibold text-slate-900">
                    {totals.picoPct.toFixed(0)}% <span className="text-slate-500 font-semibold">{fmt(totals.pico)} kWh</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        </Card>
    );
    }

    // -----------------------------
    // Gadget 3 — Meta / Progreso (circular)
    // -----------------------------

    function GadgetMetaCircular() {
    const goal = 4000;
    const current = 3730;
    const progress = (current / goal) * 100;

    const pie = [
        { name: "Ahorro", value: progress, color: COLORS.green },
        { name: "Restante", value: 100 - progress, color: "rgba(226,232,240,1)" },
    ];

    return (
        <Card className="overflow-hidden">
        <div className="p-5">
            <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: COLORS.orange }} />
            <div className="text-sm font-semibold text-slate-700">Ahorro acumulado</div>
            </div>

            <div className="mt-4 flex items-center justify-center">
            <div className="h-[220px] w-full max-w-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={pie} dataKey="value" nameKey="name" innerRadius={72} outerRadius={102} startAngle={90} endAngle={-270} paddingAngle={2}>
                    {pie.map((p, idx) => (
                        <Cell key={idx} fill={p.color} />
                    ))}
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
            </div>
            </div>

            <div className="mt-2 text-center">
            <div className="text-3xl font-bold tracking-tight text-slate-900">{fmt(current)} kWh</div>
            <div className="mt-1 text-sm text-slate-600">
                Meta {fmt(goal)} kWh • Progreso {progress.toFixed(0)}%
            </div>
            </div>

            <div className="mt-4 space-y-3">
            <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/70">
                    <Leaf className="h-5 w-5" />
                </div>
                <div className="text-[13px] leading-relaxed text-slate-800"><span className="font-semibold">Equivale</span> a 3 kg de carbono almacenado.</div>
                </div>
            </div>
            <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/70">
                    <Trees className="h-5 w-5" />
                </div>
                <div className="text-[13px] leading-relaxed text-slate-800"><span className="font-semibold">Tu ahorro</span> evitó 1.5 t CO₂ ≈ 82 árboles.</div>
                </div>
            </div>
            </div>
        </div>
        </Card>
    );
    }

    // -----------------------------
    // Page layout — cuerpo Ecofeedback (parte)
    // -----------------------------

    export default function MockupEcoFeedbackCuerpoGadgets() {
    return (
        <div className="min-h-screen bg-slate-100 from-slate-50 text-slate-900">
        <div className="w-full space-y-5">
            <GadgetConsumoMensualCategoria />

            <div className=" px-6 grid grid-cols-1 gap-3 xl:grid-cols-[1.2fr_0.8fr]">
            <GadgetDistribucionFranjaHoraria />
            <GadgetMetaCircular />
            </div>
        </div>
        </div>
    );
    }
