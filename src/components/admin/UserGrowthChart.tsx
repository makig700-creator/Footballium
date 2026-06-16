"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UserGrowthChart({ data }: { data: any[] }) {
  return (
    <div className="h-[250px] w-full mt-4 -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis 
            dataKey="month" 
            stroke="#4b5563" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#4b5563" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#374151", borderRadius: "8px", fontSize: "12px", color: "#fff" }}
            itemStyle={{ color: "#ccff00" }}
            cursor={{ stroke: '#374151', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#A3FF12" 
            strokeWidth={3}
            dot={{ fill: "#1c1a1a", stroke: "#A3FF12", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#A3FF12", stroke: "transparent" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
