"use client";

import { useReportWebVitals } from "next/web-vitals";

function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  rating?: string;
}) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", metric.name, metric.value, metric.rating ?? "");
  }
  // In production you can send to your analytics endpoint, e.g.:
  // if (navigator.sendBeacon) navigator.sendBeacon("/api/analytics", JSON.stringify(metric));
}

export function WebVitals() {
  useReportWebVitals(reportWebVitals);
  return null;
}
