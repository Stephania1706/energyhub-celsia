import React, { useMemo, useState } from "react";
import {
    Zap,
    Calendar,
    Info,
    BookOpen,
    Bell,
    ShieldAlert,
    ChevronRight,
    Search,
    X,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
type DictKey =
    | "IPP"
    | "CONTRIB"
    | "RESTR"
    | "CPROG"
    | "BOLSA"
    | "OR";
// Mockup Web - Tarifa (CU) — Educativos (COPIA)
// Ajustes solicitados:
// 1) Resumen del mes: quitar el párrafo final (recomendación).
// 2) Noticias y actualidad: texto con enfoque "oficial" (IDEAM/DIMAR/UNGRD + XM/Precio de Escasez).
// 3) Diccionario rápido: quitar buscador.
// 4) Selector de mes: hacerlo MUY visible (en header + en el gadget de cambio por componente).
// Nota: JSX puro, sin template strings/backticks para evitar errores en vista previa.

function formatCOP0(value: number): string {
    const v = Number(value || 0);
    try {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(v);
    } catch (e) {
    const sign = v < 0 ? "-" : "";
    return sign + "$" + String(Math.abs(Math.round(v)));
    }
}

function pct(a: number, b: number): number {
    if (!b) return 0;
    return (a / b) * 100;
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

type PillProps = {
    children: React.ReactNode;
    tone?: "orange" | "green" | "slate";
};
function Pill({ children, tone }: PillProps) {
    const t = tone || "slate";
    const cls =
        t === "orange"
            ? "bg-orange-50 text-orange-700 ring-orange-200"
            : t === "green"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-slate-50 text-slate-700 ring-slate-200";
    return (
        <span className={"inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ring-1 " + cls}>
            {children}
        </span>
    );
}

type CardProps = {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
};


function Card({ title, subtitle, icon, children }: CardProps) {
    return (
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 border-t-4 border-orange-200">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                    {icon ? (
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 ring-1 ring-orange-200/70">
                {icon}
                </span>
            ) : null}
            <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>
                {subtitle ? <div className="mt-0.5 text-xs text-slate-600">{subtitle}</div> : null}
            </div>
            </div>
        </div>
        </div>
        <div className="mt-4">{children}</div>
    </div>
    );
}
type ModalProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
};

function Modal({
    open,
    title,
    onClose,
    children,
}: ModalProps) {
    if (!open) return null;
    return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center">
        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <button
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                aria-label="Cerrar"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
        <div className="px-5 py-4 text-sm text-slate-700">{children}</div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
            <button
            onClick={onClose}
            className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
            >
            Entendido
            </button>
        </div>
        </div>
    </div>
    );
}

type SliderRowProps = {
    label: string;
    colorClass: string;
    value: number;
    onChange: (value: number) => void;
};
function SliderRow({
    label,
    colorClass,
    value,
    onChange,
}: SliderRowProps) {
    return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
            <span className={"h-2.5 w-2.5 rounded-full " + colorClass} />
            <div className="text-sm font-semibold text-slate-900 truncate">{label}</div>
        </div>
            <span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {value > 0 ? "+" + value + "%" : String(value) + "%"}
            </span>
        </div>
        <input
        className="mt-3 w-full"
        type="range"
        min={-10}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="mt-1 text-xs text-slate-500">Ajuste ilustrativo (no contractual).</div>
    </div>
    );
}

const DATA = [
    { mes: "mar-25", G: 373.75, T: 52.32, D: 175.84, C: 171.54, P: 69.82, O: 22.15, CU: 865.42 },
    { mes: "abr-25", G: 375.78, T: 52.61, D: 176.79, C: 172.47, P: 70.19, O: 22.27, CU: 870.12 },
    { mes: "may-25", G: 382.52, T: 53.55, D: 179.96, C: 175.57, P: 71.45, O: 22.67, CU: 885.73 },
    { mes: "jun-25", G: 381.5, T: 53.41, D: 179.48, C: 175.1, P: 71.26, O: 22.61, CU: 883.36 },
    { mes: "jul-25", G: 381.34, T: 53.39, D: 179.41, C: 175.03, P: 71.23, O: 22.6, CU: 883.0 },
    { mes: "ago-25", G: 396.42, T: 55.5, D: 186.5, C: 181.95, P: 74.05, O: 23.49, CU: 917.91 },
    { mes: "sep-25", G: 397.59, T: 55.66, D: 187.05, C: 182.48, P: 74.27, O: 23.56, CU: 920.63 },
    { mes: "oct-25", G: 397.41, T: 55.64, D: 186.97, C: 182.4, P: 74.23, O: 23.55, CU: 920.2 },
    { mes: "nov-25", G: 394.07, T: 55.17, D: 185.4, C: 180.87, P: 73.61, O: 23.36, CU: 912.47 },
    { mes: "dic-25", G: 400.22, T: 56.03, D: 188.29, C: 183.69, P: 74.76, O: 23.72, CU: 926.71 },
];

type ComponentKey = "G" | "T" | "D" | "C" | "P" | "O";
const COL: Record<ComponentKey, string> = {
    G: "bg-blue-500",
    T: "bg-orange-500",
    D: "bg-emerald-500",
    C: "bg-cyan-500",
    P: "bg-violet-500",
    O: "bg-amber-600",
};

const WHY: Record<string, string> = {
    G: "cambios en el precio de compra (bolsa/contratos)",
    T: "indexación regulatoria del componente",
    D: "indexación y ajustes del Operador de Red",
    C: "ajuste del componente de comercialización",
    P: "variación de pérdidas reconocidas (mes a mes)",
    O: "cargos complementarios del periodo (incluye cargos del sistema)",
};

const DICT: {
    key: DictKey;
    label: string;
    hint: string;
    body: string;
    example: string;
}[] = [
    {
        key: "IPP",
        label: "IPP",
        hint: "Indexador usado en algunos componentes",
        body:
            "El IPP (Índice de Precios al Productor) mide cómo cambian los precios de bienes producidos. En tarifas puede usarse como referencia para actualizar componentes regulados.",
    example: "Ejemplo: si el IPP sube, ciertos costos de operación y redes tienden a subir.",
    },
    {
    key: "CONTRIB",
    label: "Contribución",
    hint: "Cargo definido por el Gobierno",
    body:
        "La contribución es un cargo establecido por el Gobierno (no por Celsia) que puede aplicar a algunos usuarios para apoyar subsidios. Aparece en factura según el tipo de usuario.",
    example: "Ejemplo: en algunos casos se cobra un porcentaje adicional sobre el consumo.",
    },
    {
    key: "RESTR",
    label: "Restricciones",
    hint: "Cargos del sistema por operación",
    body:
        "Las restricciones son costos asociados a mantener el sistema eléctrico en equilibrio cuando se requieren ajustes por seguridad o límites de la red.",
    example: "Ejemplo: pueden reflejarse dentro de 'Otros' en algunos periodos.",
    },
    {
    key: "CPROG",
    label: "CPROG",
    hint: "Componente regulado",
    body:
        "CPROG es un componente regulado asociado a programas del sistema (por ejemplo, iniciativas para reducción de pérdidas o mejoras).",
    example: "Ejemplo: su valor suele cambiar por actualizaciones regulatorias.",
    },
    {
    key: "BOLSA",
    label: "Bolsa",
    hint: "Precio diario del mercado",
    body:
        "La bolsa es el precio del mercado de energía que varía día a día. Si tu energía está indexada a bolsa, Generación (G) puede moverse.",
    example: "Ejemplo: meses con alta demanda o baja oferta pueden empujar la bolsa al alza.",
    },
    {
    key: "OR",
    label: "Operador de Red",
    hint: "Dueño/operador de redes locales",
    body:
        "El Operador de Red (OR) es quien opera las redes de distribución locales. Cambios en Distribución (D) suelen venir de actualizaciones del OR y regulación.",
    example: "Ejemplo: ajustes en cargos de distribución aprobados por regulación.",
    },
];

export default function TarifaEducation() {
    const [sel, setSel] = useState(DATA.length - 1);
    const [openKey, setOpenKey] = useState<DictKey | null>(null);

    const [gAdj, setGAdj] = useState(0);
    const [tAdj, setTAdj] = useState(0);
    const [dAdj, setDAdj] = useState(0);
    const [cAdj, setCAdj] = useState(0);
    const [pAdj, setPAdj] = useState(0);
    const [oAdj, setOAdj] = useState(0);

    const cur = DATA[clamp(sel, 0, DATA.length - 1)];
    const prev = DATA[clamp(sel - 1, 0, DATA.length - 1)];

const deltas = useMemo(() => {
    const rows = [
        { key: "G", name: "Generación (G)", delta: cur.G - prev.G },
        { key: "T", name: "Transmisión (T)", delta: cur.T - prev.T },
        { key: "D", name: "Distribución (D)", delta: cur.D - prev.D },
        { key: "C", name: "Comercialización (C)", delta: cur.C - prev.C },
        { key: "P", name: "Pérdidas (P)", delta: cur.P - prev.P },
        { key: "O", name: "Otros", delta: cur.O - prev.O },
    ].map((r) => ({ key: r.key, name: r.name, delta: Number(r.delta.toFixed(2)) }));

    const maxAbs = Math.max(1, ...rows.map((r) => Math.abs(r.delta)));
    return { rows, maxAbs };
    }, [cur, prev]);

    const driver = useMemo(() => {
        const sorted = deltas.rows.slice().sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    return sorted[0];
    }, [deltas]);

    const deltaCU = cur.CU - prev.CU;
    const deltaPct = pct(deltaCU, prev.CU);

    const sim = useMemo(() => {
    const base = { G: cur.G, T: cur.T, D: cur.D, C: cur.C, P: cur.P, O: cur.O };
    const next = {
      G: base.G * (1 + gAdj / 100),
      T: base.T * (1 + tAdj / 100),
      D: base.D * (1 + dAdj / 100),
      C: base.C * (1 + cAdj / 100),
      P: base.P * (1 + pAdj / 100),
      O: base.O * (1 + oAdj / 100),
    };

    const baseCU = base.G + base.T + base.D + base.C + base.P + base.O;
    const nextCU = next.G + next.T + next.D + next.C + next.P + next.O;

    const delta = nextCU - baseCU;
    const deltaPct2 = baseCU ? (delta / baseCU) * 100 : 0;

    return { baseCU, nextCU, delta, deltaPct: deltaPct2 };
    }, [cur, gAdj, tAdj, dAdj, cAdj, pAdj, oAdj]);

    const openItem = useMemo(() => {
    return DICT.find((x) => x.key === openKey) || null;
    }, [openKey]);

    return (
    <div className="w-full">
        <div className="w-full">
            <div className="mt-4 flex flex-wrap items-center gap-2">
                
            </div>
      

        {/* ¿Qué movió tu tarifa? */}
        <Card
            title="¿Qué movió tu tarifa este mes?"
            subtitle={"Comparación " + prev.mes + " → " + cur.mes}
            icon={<ShieldAlert className="h-5 w-5" />}
        >
          {/* Reforzar visibilidad del mes dentro del gadget */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <div className="text-sm font-semibold text-slate-900">Mes seleccionado para el análisis</div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-orange-50 px-3 py-2 ring-1 ring-orange-200">
                    <Calendar className="h-4 w-4 text-orange-700" />
                    <span className="text-sm font-bold text-slate-900">{cur.mes}</span>
                    <span className="text-xs text-slate-600">(comparado con {prev.mes})</span>
                </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">Cambio por componente (COP/kWh)</div>
                    <Pill tone="orange">
                        <Info className="h-4 w-4" />
                        ilustrativo
                    </Pill>
            </div>

            <div className="mt-2 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
                <div className="grid grid-cols-12 gap-2 bg-slate-50 px-4 py-3">
                    <div className="col-span-12 sm:col-span-5 text-xs font-semibold text-slate-600">Componente</div>
                    <div className="col-span-6 sm:col-span-2 text-right text-xs font-semibold text-slate-600">Δ</div>
                    <div className="col-span-6 sm:col-span-5 text-xs font-semibold text-slate-600">¿Por qué?</div>
                </div>

            <div className="divide-y divide-slate-100">
                {deltas.rows.map((r) => {
                    const up = r.delta > 0;
                    const down = r.delta < 0;
                  const w = (Math.abs(r.delta) / deltas.maxAbs) * 100;
                    const reason = down
                    ? "Bajó por " + WHY[r.key] + "."
                    : up
                    ? "Subió por " + WHY[r.key] + "."
                    : "Se mantuvo sin cambios relevantes.";

                return (
                    <div key={r.key} className="px-4 py-3 hover:bg-slate-50/70">
                    <div className="grid grid-cols-12 items-start gap-2">
                        <div className="col-span-12 sm:col-span-5 flex min-w-0 items-center gap-2">
                            <span className={"mt-1 h-2.5 w-2.5 rounded-full " + (COL[r.key as ComponentKey] || "bg-slate-400")} />
                            <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">{r.name}</div>
                            <div className="mt-0.5 text-xs text-slate-500">
                                {prev.mes} → {cur.mes}
                            </div>
                            </div>
                        </div>

                        <div className="col-span-6 sm:col-span-2 flex flex-col items-end">
                            <span
                            className={
                                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ring-1 " +
                                (up
                                ? "bg-red-50 text-red-700 ring-red-200"
                                : down
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : "bg-slate-50 text-slate-700 ring-slate-200")
                            }
                          >
                            {up ? <ArrowUpRight className="h-4 w-4" /> : down ? <ArrowDownRight className="h-4 w-4" /> : null}
                            {(up ? "+" : down ? "-" : "") + formatCOP0(Math.abs(r.delta))}
                          </span>

                          <div className="mt-2 h-1.5 w-[110px] overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                            <div
                              className={up ? "h-full bg-red-400" : down ? "h-full bg-emerald-400" : "h-full bg-slate-300"}
                              style={{ width: String(Math.max(2, Math.min(100, w))) + "%" }}
                            />
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-5 min-w-0">
                          <div
                            className="text-sm text-slate-700"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {reason}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
              <div className="text-xs text-slate-600">Lo que más movió el CU</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {driver ? driver.name : "—"}: {(driver && driver.delta >= 0 ? "+" : "") + formatCOP0(driver ? driver.delta : 0)} COP/kWh
              </div>
            </div>
          </div>
        </Card>

        {/* Checklist + Resumen del mes */}
        <div className="mt-4">
          <Card title="Checklist para entender tu factura" subtitle="Lo mínimo que deberías revisar cada mes" icon={<BookOpen className="h-5 w-5" />}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-7">
                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                    <li><b>¿Subió el CU?</b> Compara contra el mes anterior y ubica el % de cambio.</li>
                    <li><b>Identifica el componente</b> que más pesa: normalmente G, D o C.</li>
                    <li><b>Verifica si fue regulado</b>: cuando se mueve T o D suele venir por actualización.</li>
                    <li><b>Revisa 'Otros'</b> si ves un salto raro: puede ser cargos del sistema.</li>
                    <li><b>Confirma consumo (kWh)</b>: a veces el valor final cambia por consumo, no solo por CU.</li>
                  </ol>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">Resumen del mes</div>
                  <div className="mt-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 text-sm text-slate-700">
                    <p>
                      En {cur.mes}, el CU cerró en <b>{formatCOP0(cur.CU)}</b> por kWh, con una variación de <b>{formatCOP0(deltaCU)}</b> ({deltaPct.toFixed(1)}%) frente a {prev.mes}.
                    </p>
                    <p className="mt-2">
                      El principal factor del cambio fue <b>{driver ? driver.name : "—"}</b>, con un impacto estimado de <b>{(driver && driver.delta >= 0 ? "+" : "") + formatCOP0(driver ? driver.delta : 0)}</b> COP/kWh (lectura ilustrativa).
                    </p>
                    {/* Párrafo final eliminado por solicitud */}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Diccionario rápido (sin buscador) */}
        <div className="mt-4">
          <Card title="Diccionario rápido" subtitle="Términos que más preguntan (clic y listo)." icon={<BookOpen className="h-5 w-5" />}>
            <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Términos frecuentes</div>
                <Pill tone="orange">
                  <Info className="h-4 w-4" />
                  ayuda
                </Pill>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {DICT.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setOpenKey(t.key)}
                    className="rounded-2xl bg-white px-3 py-3 text-left ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-900">{t.label}</div>
                      <ChevronRight className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="mt-1 text-xs text-slate-600">{t.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Alertas y actualidad (con enfoque oficial) */}
        <div className="mt-4">
          <Card title="Alertas y actualidad" subtitle="Para enterarte a tiempo de lo que puede mover tu tarifa" icon={<Bell className="h-5 w-5" />}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-6">
                <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Alertas (clima y riesgo)</div>
                    <Pill tone="orange">oficial</Pill>
                  </div>
                  <div className="mt-2 space-y-2 text-sm text-slate-700">
                    <p><b>Alerta IDEAM:</b> incremento de lluvias y probabilidad de crecientes súbitas / deslizamientos en varias regiones.</p>
                    <p><b>DIMAR:</b> ingreso de frente frío puede aumentar viento y oleaje en el Caribe (impacto operativo en zonas costeras).</p>
                    <p><b>UNGRD:</b> mantiene articulación territorial y seguimiento por emergencias asociadas a inundaciones y movimientos en masa.</p>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-6">
                <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Noticias (mercado y confiabilidad)</div>
                    <Pill>oficial</Pill>
                  </div>
                  <div className="mt-2 space-y-2 text-sm text-slate-700">
                    <p><b>XM:</b> en enero de 2026 reportó precio promedio de bolsa de 213 COP/kWh y un PTB calculado solo en los primeros días del mes.</p>
                    <p><b>Precio de escasez:</b> la regulación define umbrales y, cuando el precio de bolsa los supera, se activa la señal de escasez y las OEF.</p>
                    <p><b>Dato enero (XM):</b> tres precios de escasez (PEI/PE/PES) se publican mensualmente y son referencia para transacciones en bolsa.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Simulador (último) */}
        <div className="mt-4">
          <Card title="Explora tu tarifa" subtitle="¿Qué pasa si sube o baja un componente? (ilustrativo)" icon={<ShieldAlert className="h-5 w-5" />}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-7">
                <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Ajustes por componente</div>
                      <div className="mt-1 text-xs text-slate-600">Mueve los sliders (+/- 10%) y mira el impacto.</div>
                    </div>
                    <Pill tone="orange">
                      <Info className="h-4 w-4" />
                      ilustrativo
                    </Pill>
                  </div>

                  <div className="mt-3 space-y-3">
                    <SliderRow label="Generación (G)" colorClass={COL.G} value={gAdj} onChange={setGAdj} />
                    <SliderRow label="Transmisión (T)" colorClass={COL.T} value={tAdj} onChange={setTAdj} />
                    <SliderRow label="Distribución (D)" colorClass={COL.D} value={dAdj} onChange={setDAdj} />
                    <SliderRow label="Comercialización (C)" colorClass={COL.C} value={cAdj} onChange={setCAdj} />
                    <SliderRow label="Pérdidas (P)" colorClass={COL.P} value={pAdj} onChange={setPAdj} />
                    <SliderRow label="Otros" colorClass={COL.O} value={oAdj} onChange={setOAdj} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setGAdj(0);
                        setTAdj(0);
                        setDAdj(0);
                        setCAdj(0);
                        setPAdj(0);
                        setOAdj(0);
                      }}
                      className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Reiniciar
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-semibold text-slate-900">Resultado</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <div className="text-xs text-slate-600">CU base</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">{formatCOP0(sim.baseCU)} / kWh</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <div className="text-xs text-slate-600">CU simulado</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">{formatCOP0(sim.nextCU)} / kWh</div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-slate-600">Variación</div>
                      <Pill tone={sim.delta >= 0 ? "orange" : "green"}>
                        {sim.delta >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {(sim.delta >= 0 ? "+" : "") + formatCOP0(sim.delta)} ({sim.deltaPct.toFixed(1)}%)
                      </Pill>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">Este simulador ayuda a entender sensibilidad. No reemplaza la liquidación real.</div>
                  </div>

                  <div className="mt-3 rounded-2xl bg-orange-50/40 p-3 ring-1 ring-orange-200/70 text-sm text-slate-700">
                    <b>Tip:</b> si sube Generación, suele ser mercado (bolsa/contratos). Si sube T/D, suele ser regulado.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Modal Diccionario */}
        <Modal open={!!openItem} title={openItem ? openItem.label : ""} onClose={() => setOpenKey(null)}>
          {openItem ? (
            <div>
              <p>{openItem.body}</p>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 text-sm text-slate-700">
                <b>Ejemplo:</b> {openItem.example}
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </div>
  );
}
