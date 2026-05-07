import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ComparisonBarChartProps<T extends Record<string, string | number>> = {
  data: T[];
  xKey: keyof T;
  firstKey: keyof T;
  secondKey: keyof T;
  firstName: string;
  secondName: string;
  summary?: string;
};

export function ComparisonBarChart<T extends Record<string, string | number>>({
  data,
  xKey,
  firstKey,
  secondKey,
  firstName,
  secondName,
  summary
}: ComparisonBarChartProps<T>) {
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
            <Tooltip contentStyle={{ border: "1px solid rgba(0,53,74,.12)", boxShadow: "0 12px 30px rgba(0,40,58,.12)" }} />
            <Legend />
            <Bar dataKey={String(firstKey)} name={firstName} fill="#DCEFA3" />
            <Bar dataKey={String(secondKey)} name={secondName} fill="#00354A" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {summary ? <p className="mt-3 border-l-4 border-limeSoft bg-mist/50 p-3 text-sm font-semibold leading-6 text-muted">{summary}</p> : null}
    </>
  );
}
