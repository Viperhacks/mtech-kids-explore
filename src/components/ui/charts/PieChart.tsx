
import * as React from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

export function PieChart({ data, className }: PieChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <ChartContainer className={className} config={{}}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              labelFormatter={(label) => `${label}`}
            />
          )}
        />
        <Legend />
      </RechartsPieChart>
    </ChartContainer>
  );
}
