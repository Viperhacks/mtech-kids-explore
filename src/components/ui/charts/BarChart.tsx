
import * as React from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

export function BarChart({ data, className }: BarChartProps) {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              labelFormatter={(label) => `${label}`}
            />
          )}
        />
        <Bar
          dataKey="value"
          fill="var(--color-primary)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </RechartsBarChart>
    </ChartContainer>
  );
}
