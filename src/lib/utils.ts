import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("es-ES").format(n);
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDateShort(d: Date | string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(
    new Date(d)
  );
}

export function parseList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
