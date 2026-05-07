import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MetricBarChartProps<T extends Record<string, string | number>> = {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: string;
  suffix?: string;
  summary?: string;
};

export function MetricBarChart<T extends Record<string, string | number>>({
  data,
  xKey,
  yKey,
  color = "#0A4B61",
  suffix = "",
  summary
}: MetricBarChartProps<T>) {
  if (!data.length) {
    return <p className="border border-petrol-800/10 bg-mist/50 p-4 text-sm font-semibold text-muted">Pas encore assez de données pour afficher ce graphique.</p>;
  }

  return (
    <>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E3E9E9" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey={String(xKey)} tick={{ fontSize: 13, fill: "#6F8188", fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 13, fill: "#6F8188", fontWeight: 700 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ border: "1px solid rgba(0,53,74,.12)", boxShadow: "0 12px 30px rgba(0,40,58,.12)" }}
              formatter={(value) => [`${value}${suffix}`, ""]}
            />
            <Bar dataKey={String(yKey)} fill={color} radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {summary ? <p className="mt-3 border-l-4 border-limeSoft bg-mist/50 p-3 text-sm font-semibold leading-6 text-muted">{summary}</p> : null}
    </>
  );
}
