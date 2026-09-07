import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Droplet,
  Gauge,
  Radio,
  Search,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { translations } from "../i18n/translations";
import { useLanguageStore } from "../store/useLanguageStore";

type AssetStatus = "normal" | "warning" | "critical";

type LocalizedText = { es: string; en: string };

type Well = {
  id: string;
  name: string;
  location: LocalizedText;
  status: AssetStatus;
  pressure: number;
  temperature: number;
};

type AlertSeverity = "info" | "warning" | "critical";

type AlertEvent = {
  id: string;
  time: string;
  message: LocalizedText;
  severity: AlertSeverity;
};

type ProductionPoint = {
  hour: string;
  bpd: number;
};

const WELLS: Well[] = [
  {
    id: "w-01",
    name: "Pozo Cardón IV",
    location: { es: "Cuenca de Falcón, VE", en: "Falcón Basin, VE" },
    status: "normal",
    pressure: 1420,
    temperature: 78,
  },
  {
    id: "w-02",
    name: "Pozo Bare-1X",
    location: { es: "Faja del Orinoco, VE", en: "Orinoco Belt, VE" },
    status: "warning",
    pressure: 1610,
    temperature: 91,
  },
  {
    id: "w-03",
    name: "Pozo Lagunillas-7",
    location: { es: "Lago de Maracaibo, VE", en: "Lake Maracaibo, VE" },
    status: "normal",
    pressure: 1380,
    temperature: 74,
  },
  {
    id: "w-04",
    name: "Pozo Tía Juana-12",
    location: { es: "Zulia, VE", en: "Zulia, VE" },
    status: "critical",
    pressure: 1875,
    temperature: 104,
  },
  {
    id: "w-05",
    name: "Pozo Boscán-3",
    location: { es: "Zulia, VE", en: "Zulia, VE" },
    status: "normal",
    pressure: 1410,
    temperature: 76,
  },
];

const ALERTS: AlertEvent[] = [
  {
    id: "a-1",
    time: "09:42:11",
    message: {
      es: "Presión de red por encima del umbral en Pozo Tía Juana-12",
      en: "Network pressure above threshold at Well Tía Juana-12",
    },
    severity: "critical",
  },
  {
    id: "a-2",
    time: "09:15:47",
    message: {
      es: "Vibración anómala detectada en bomba de Pozo Bare-1X",
      en: "Anomalous vibration detected on Well Bare-1X pump",
    },
    severity: "warning",
  },
  {
    id: "a-3",
    time: "08:58:03",
    message: {
      es: "Recalibración automática de sensor completada en Pozo Boscán-3",
      en: "Automatic sensor recalibration completed at Well Boscán-3",
    },
    severity: "info",
  },
  {
    id: "a-4",
    time: "08:30:22",
    message: {
      es: "Mantenimiento preventivo programado para Pozo Lagunillas-7",
      en: "Preventive maintenance scheduled for Well Lagunillas-7",
    },
    severity: "info",
  },
  {
    id: "a-5",
    time: "07:54:16",
    message: {
      es: "Caída temporal de telemetría en Pozo Cardón IV (restablecida)",
      en: "Temporary telemetry outage at Well Cardón IV (restored)",
    },
    severity: "warning",
  },
];

const PRODUCTION_DATA: ProductionPoint[] = [
  { hour: "00:00", bpd: 13120 },
  { hour: "02:00", bpd: 13340 },
  { hour: "04:00", bpd: 13580 },
  { hour: "06:00", bpd: 13890 },
  { hour: "08:00", bpd: 14020 },
  { hour: "10:00", bpd: 14180 },
  { hour: "12:00", bpd: 14250 },
  { hour: "14:00", bpd: 14190 },
  { hour: "16:00", bpd: 14310 },
  { hour: "18:00", bpd: 14260 },
  { hour: "20:00", bpd: 14150 },
  { hour: "22:00", bpd: 14250 },
];

const STATUS_STYLES: Record<AssetStatus, { badge: string; dot: string }> = {
  normal: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  warning: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
  },
  critical: {
    badge: "bg-red-500/10 text-red-400 border-red-500/30",
    dot: "bg-red-400",
  },
};

const SEVERITY_STYLES: Record<AlertSeverity, { dot: string; text: string }> = {
  info: { dot: "bg-sky-400", text: "text-sky-400" },
  warning: { dot: "bg-amber-400", text: "text-amber-400" },
  critical: { dot: "bg-red-400", text: "text-red-400" },
};

function useLiveClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "emerald" | "sky" | "amber" | "red";
}) {
  const accentStyles: Record<typeof accent, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    sky: "text-sky-400 bg-sky-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    red: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
      </div>
      <div className={`rounded-md p-2.5 ${accentStyles[accent]}`}>{icon}</div>
    </div>
  );
}

function LanguageToggle() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <div className="flex items-center rounded-full border border-slate-800 bg-slate-900 p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLanguage("es")}
        aria-pressed={language === "es"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          language === "es"
            ? "bg-emerald-500/10 text-emerald-400"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          language === "en"
            ? "bg-emerald-500/10 text-emerald-400"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        EN
      </button>
    </div>
  );
}

export default function OilFlowDashboard() {
  const now = useLiveClock();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const formattedTime = useMemo(
    () =>
      now.toLocaleTimeString(t.locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    [now, t.locale]
  );

  const formattedDate = useMemo(
    () =>
      now.toLocaleDateString(t.locale, {
        weekday: "long",
        day: "2-digit",
        month: "long",
      }),
    [now, t.locale]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-emerald-500/10 p-2">
              <Droplet className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-50">
                OilFlow 360
              </h1>
              <p className="text-xs text-slate-400">{t.header.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-emerald-400">
                {t.header.liveTelemetry}
              </span>
            </div>

            <div className="hidden text-right sm:block">
              <p className="font-mono text-sm font-semibold text-slate-100">
                {formattedTime}
              </p>
              <p className="text-xs capitalize text-slate-400">
                {formattedDate}
              </p>
            </div>

            <LanguageToggle />

            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <UserCircle className="h-8 w-8 text-slate-500" />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-200">
                  {t.header.operatorName}
                </p>
                <p className="text-xs text-slate-500">
                  {t.header.operatorRole}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={<Droplet className="h-5 w-5" />}
            label={t.kpis.productionTotal}
            value="14,250 bpd"
            accent="emerald"
          />
          <KpiCard
            icon={<Gauge className="h-5 w-5" />}
            label={t.kpis.operationalEfficiency}
            value="98.2%"
            accent="sky"
          />
          <KpiCard
            icon={<Activity className="h-5 w-5" />}
            label={t.kpis.networkPressure}
            value="1,450 PSI"
            accent="amber"
          />
          <KpiCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label={t.kpis.activeAlerts}
            value="2"
            accent="red"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">
                  {t.chart.title}
                </h2>
                <p className="text-xs text-slate-500">{t.chart.subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">+1.9%</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PRODUCTION_DATA}>
                  <defs>
                    <linearGradient id="productionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#1e293b" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#1e293b" }}
                    domain={["dataMin - 300", "dataMax + 300"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "0.5rem",
                      color: "#e2e8f0",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                    formatter={(value) => [
                      `${Number(value).toLocaleString()} bpd`,
                      t.chart.tooltipLabel,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="bpd"
                    stroke="#34d399"
                    strokeWidth={2}
                    fill="url(#productionFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Radio className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                {t.events.title}
              </h2>
            </div>
            <ul className="space-y-3">
              {ALERTS.map((alert) => {
                const style = SEVERITY_STYLES[alert.severity];
                return (
                  <li key={alert.id} className="flex gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${style.dot}`}
                    />
                    <div>
                      <p className="text-sm leading-snug text-slate-300">
                        {alert.message[language]}
                      </p>
                      <p className={`mt-0.5 text-xs font-mono ${style.text}`}>
                        {alert.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-4 text-sm font-semibold text-slate-200">
            {t.wells.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-4 font-medium">
                    {t.wells.columns.name}
                  </th>
                  <th className="pb-2 pr-4 font-medium">
                    {t.wells.columns.location}
                  </th>
                  <th className="pb-2 pr-4 font-medium">
                    {t.wells.columns.status}
                  </th>
                  <th className="pb-2 pr-4 font-medium">
                    {t.wells.columns.pressure}
                  </th>
                  <th className="pb-2 pr-4 font-medium">
                    {t.wells.columns.temperature}
                  </th>
                  <th className="pb-2 font-medium">
                    {t.wells.columns.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {WELLS.map((well) => {
                  const style = STATUS_STYLES[well.status];
                  return (
                    <tr key={well.id} className="text-slate-300">
                      <td className="py-3 pr-4 font-medium text-slate-100">
                        {well.name}
                      </td>
                      <td className="py-3 pr-4 text-slate-400">
                        {well.location[language]}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {t.wells.status[well.status]}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-mono">
                        {well.pressure.toLocaleString()} PSI
                      </td>
                      <td className="py-3 pr-4 font-mono">
                        {well.temperature}°C
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
                        >
                          <Search className="h-3.5 w-3.5" />
                          {t.wells.inspect}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
