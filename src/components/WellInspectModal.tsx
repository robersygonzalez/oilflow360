import { X } from "lucide-react";
import { translations } from "../i18n/translations";
import { WELL_STATUS_STYLES } from "../lib/wellStatusStyles";
import { useLanguageStore } from "../store/useLanguageStore";
import { useOilFlowStore } from "../store/useOilFlowStore";

export default function WellInspectModal() {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  const selectedWellId = useOilFlowStore((state) => state.selectedWellId);
  const wells = useOilFlowStore((state) => state.wells);
  const selectWell = useOilFlowStore((state) => state.selectWell);
  const setWellStatus = useOilFlowStore((state) => state.setWellStatus);

  const well = wells.find((candidate) => candidate.id === selectedWellId);
  if (!well) {
    return null;
  }

  const style = WELL_STATUS_STYLES[well.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
      onClick={() => selectWell(null)}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-100">
            {t.modal.title}
          </h2>
          <button
            type="button"
            onClick={() => selectWell(null)}
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold text-slate-100">{well.name}</p>
            <p className="text-sm text-slate-400">{well.location[language]}</p>
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">
              {t.modal.currentStatus}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {t.wells.status[well.status]}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-slate-800 p-3 text-center">
              <p className="text-xs text-slate-500">
                {t.wells.columns.pressure}
              </p>
              <p className="mt-1 font-mono text-sm text-slate-100">
                {Math.round(well.pressure).toLocaleString()} PSI
              </p>
            </div>
            <div className="rounded-md border border-slate-800 p-3 text-center">
              <p className="text-xs text-slate-500">
                {t.wells.columns.temperature}
              </p>
              <p className="mt-1 font-mono text-sm text-slate-100">
                {well.temperature.toFixed(1)}°C
              </p>
            </div>
            <div className="rounded-md border border-slate-800 p-3 text-center">
              <p className="text-xs text-slate-500">
                {t.wells.columns.production}
              </p>
              <p className="mt-1 font-mono text-sm text-slate-100">
                {Math.round(well.production).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {well.status !== "maintenance" ? (
              <button
                type="button"
                onClick={() => setWellStatus(well.id, "maintenance")}
                className="flex-1 rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-400 transition-colors hover:bg-sky-500/20"
              >
                {t.modal.setMaintenance}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setWellStatus(well.id, "operational")}
                className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                {t.modal.setOperational}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
