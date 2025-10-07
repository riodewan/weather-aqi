"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

type HourPoint = { time: string; temp: number | null };

function pickNext24Hours(hourly: HourPoint[]) {
  const now = Date.now();
  const next = hourly.filter(h => new Date(h.time).getTime() >= now);
  if (next.length >= 24) return next.slice(0, 24);
  if (hourly.length >= 24) return hourly.slice(0, 24);
  return hourly;
}

export default function ChartTemp({ hourly }: { hourly: HourPoint[] }) {
  const data = useMemo(() => {
    const picked = pickNext24Hours(hourly);
    return picked.map(d => ({
      hour: new Date(d.time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      tempNum: d.temp ?? 0,
    }));
  }, [hourly]);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" interval={2} />
          <YAxis width={36} domain={["auto", "auto"]} />
          <Tooltip
            formatter={(v: any) => [`${v}°C`, "Suhu"]}
            labelFormatter={(l) => `Jam ${l}`}
          />
          <Line type="monotone" dataKey="tempNum" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}