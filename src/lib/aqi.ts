export type AQSummary = {
  category: "Baik" | "Sedang" | "Tidak Sehat bagi Kelompok Sensitif" | "Tidak Sehat" | "Sangat Tidak Sehat" | "Berbahaya";
  level: number;
  dominant: "pm25" | "pm10" | "unknown";
};

// PM2.5:   0-12, 12.1-35.4, 35.5-55.4, 55.5-150.4, 150.5-250.4, >250.4
// PM10:    0-54, 55-154,    155-254,   255-354,    355-424,     >424
function categoryPm25(v: number): AQSummary {
  if (v <= 12) return { category: "Baik", level: 1, dominant: "pm25" };
  if (v <= 35.4) return { category: "Sedang", level: 2, dominant: "pm25" };
  if (v <= 55.4) return { category: "Tidak Sehat bagi Kelompok Sensitif", level: 3, dominant: "pm25" };
  if (v <= 150.4) return { category: "Tidak Sehat", level: 4, dominant: "pm25" };
  if (v <= 250.4) return { category: "Sangat Tidak Sehat", level: 5, dominant: "pm25" };
  return { category: "Berbahaya", level: 6, dominant: "pm25" };
}

function categoryPm10(v: number): AQSummary {
  if (v <= 54) return { category: "Baik", level: 1, dominant: "pm10" };
  if (v <= 154) return { category: "Sedang", level: 2, dominant: "pm10" };
  if (v <= 254) return { category: "Tidak Sehat bagi Kelompok Sensitif", level: 3, dominant: "pm10" };
  if (v <= 354) return { category: "Tidak Sehat", level: 4, dominant: "pm10" };
  if (v <= 424) return { category: "Sangat Tidak Sehat", level: 5, dominant: "pm10" };
  return { category: "Berbahaya", level: 6, dominant: "pm10" };
}

export function summarizeAQ(pm25?: number | null, pm10?: number | null): AQSummary | null {
  if (pm25 == null && pm10 == null) return null;
  const a = pm25 == null ? null : categoryPm25(pm25);
  const b = pm10 == null ? null : categoryPm10(pm10);

  if (a && b) {
    return a.level >= b.level ? a : b;
  }
  return a ?? b ?? null;
}