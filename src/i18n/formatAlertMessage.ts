import type { Language } from "../store/useLanguageStore";
import type { AlertEvent } from "../store/useOilFlowStore";
import type { Translation } from "./translations";

export function formatAlertMessage(
  alert: AlertEvent,
  language: Language,
  t: Translation
): string {
  if (alert.message) {
    return alert.message[language];
  }

  if (!alert.template) {
    return "";
  }

  const template = t.alerts[alert.template];
  return template
    .replace("{well}", alert.wellName ?? "")
    .replace("{value}", alert.value !== undefined ? String(alert.value) : "");
}
