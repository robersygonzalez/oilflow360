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
import { formatAlertMessage } from "../i18n/formatAlertMessage";
import { translations } from "../i18n/translations";
import { WELL_STATUS_STYLES } from "../lib/wellStatusStyles";
import { useLanguageStore } from "../store/useLanguageStore";
import {
  useOilFlowStore,
  useTelemetrySimulator,
  type WellStatus,
} from "../store/useOilFlowStore";
import WellInspectModal from "./WellInspectModal";

const SEVERITY_STYLES: Record<string, { dot: string; text: string }> = {
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
  useTelemetrySimulator();

  const now = useLiveClock();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const wells = useOilFlowStore((state) => state.wells);
  const history = useOilFlowStore((state) => state.history);
  const alerts = useOilFlowStore((state) => state.alerts);
  const selectWell = useOilFlowStore((state) => state.selectWell);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<WellStatus | "all">("all");

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

  const totalProduction = useMemo(
    () => wells.reduce((sum, well) => sum + well.production, 0),
    [wells]
  );

  const averagePressure = useMemo(
    () =>
      wells.length
        ? Math.round(
            wells.reduce((sum, well) => sum + well.pressure, 0) / wells.length
          )
        : 0,
    [wells]
  );

  const criticalCount = useMemo(
    () => wells.filter((well) => well.status === "critical").length,
    [wells]
  );

  const efficiency = useMemo(
    () =>
      wells.length
        ? (((wells.length - criticalCount) / wells.length) * 100).toFixed(1)
        : "0.0",
    [wells, criticalCount]
  );

  const filteredWells = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return wells.filter((well) => {
      const matchesStatus = statusFilter === "all" || well.status === statusFilter;
      const matchesQuery =
        query === "" ||
        well.name.toLowerCase().includes(query) ||
        well.location.es.toLowerCase().includes(query) ||
        well.location.en.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [wells, searchText, statusFilter]);

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
            value={`${Math.round(totalProduction).toLocaleString()} bpd`}
            accent="emerald"
          />
          <KpiCard
            icon={<Gauge className="h-5 w-5" />}
            label={t.kpis.operationalEfficiency}
            value={`${efficiency}%`}
            accent="sky"
          />
          <KpiCard
            icon={<Activity className="h-5 w-5" />}
            label={t.kpis.networkPressure}
            value={`${averagePressure.toLocaleString()} PSI`}
            accent="amber"
          />
          <KpiCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label={t.kpis.activeAlerts}
            value={String(criticalCount)}
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
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="productionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
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
                    isAnimationActive={false}
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
            <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {alerts.map((alert) => {
                const style = SEVERITY_STYLES[alert.severity];
                return (
                  <li key={alert.id} className="flex gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${style.dot}`}
                    />
                    <div>
                      <p className="text-sm leading-snug text-slate-300">
                        {formatAlertMessage(alert, language, t)}
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-200">
              {t.wells.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder={t.wells.searchPlaceholder}
                  className="w-56 rounded-md border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as WellStatus | "all")
                }
                className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500/50 focus:outline-none"
              >
                <option value="all">{t.wells.filterAllStatuses}</option>
                <option value="operational">{t.wells.status.operational}</option>
                <option value="maintenance">{t.wells.status.maintenance}</option>
                <option value="critical">{t.wells.status.critical}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
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
                {filteredWells.map((well) => {
                  const style = WELL_STATUS_STYLES[well.status];
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
                        {Math.round(well.pressure).toLocaleString()} PSI
                      </td>
                      <td className="py-3 pr-4 font-mono">
                        {well.temperature.toFixed(1)}°C
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => selectWell(well.id)}
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

      <WellInspectModal />
    </div>
  );
}
