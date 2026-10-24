export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const pad = (n: number): string => String(n).padStart(2, "0");

export const enc = encodeURIComponent;
