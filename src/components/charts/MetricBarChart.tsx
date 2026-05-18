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
    return <p className="rounded-card border border-petrol-800/10 bg-mist/50 p-4 text-sm font-semibold text-muted">Pas encore assez de donnees pour afficher ce graphique.</p>;
  }

  return (
    <>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#E3E9E9" strokeDasharray="3 8" vertical={false} />
            <XAxis dataKey={String(xKey)} tick={{ fontSize: 11, fill: "#6F8188", fontWeight: 800 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6F8188", fontWeight: 800 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(220,239,163,.22)" }}
              contentStyle={{ border: "1px solid rgba(0,53,74,.10)", borderRadius: "18px", boxShadow: "0 18px 42px rgba(0,40,58,.14)", fontWeight: 800 }}
              formatter={(value) => [`${value}${suffix}`, ""]}
            />
            <Bar dataKey={String(yKey)} fill={color} radius={[12, 12, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {summary ? <p className="mt-3 rounded-card bg-mist/50 p-3 text-sm font-semibold leading-6 text-muted ring-1 ring-petrol-800/5">{summary}</p> : null}
    </>
  );
}
