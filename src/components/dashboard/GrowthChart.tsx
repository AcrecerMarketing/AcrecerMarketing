"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDateShort, formatNumber } from "@/lib/utils";

export type GrowthPoint = {
  date: string;
  followers: number;
  newFollowers: number;
};

export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => formatDateShort(d)}
          stroke="rgba(255,255,255,0.35)"
          tick={{ fontSize: 12 }}
          minTickGap={30}
        />
        <YAxis
          stroke="rgba(255,255,255,0.35)"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => formatNumber(v)}
          width={60}
        />
        <Tooltip
          contentStyle={{
            background: "#1b1330",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            fontSize: 13,
          }}
          labelFormatter={(d) => formatDateShort(d as string)}
          formatter={(value: number, name: string) => [
            formatNumber(value),
            name === "followers" ? "Seguidores" : "Nuevos seguidores",
          ]}
        />
        <Area
          type="monotone"
          dataKey="followers"
          stroke="#a78bfa"
          strokeWidth={2.5}
          fill="url(#followersGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
