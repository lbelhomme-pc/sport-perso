import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type MetricLineChartProps<T extends Record<string, string | number>> = {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string;
  suffix?: string;
};

export function MetricLineChart<T extends Record<string, string | number>>({
  data,
  xKey,
  yKey,
  color = "#00354A",
  suffix = ""
}: MetricLineChartProps<T>) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#E3E9E9" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={String(xKey)} tick={{ fontSize: 11, fill: "#8A9AA0", fontWeight: 700 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#8A9AA0", fontWeight: 700 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ border: "1px solid rgba(0,53,74,.12)", boxShadow: "0 12px 30px rgba(0,40,58,.12)" }}
            formatter={(value) => [`${value}${suffix}`, ""]}
          />
          <Line type="monotone" dataKey={String(yKey)} stroke={color} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
