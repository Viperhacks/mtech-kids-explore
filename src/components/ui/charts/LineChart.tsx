
import * as React from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface LineChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

export function LineChart({ data, className }: LineChartProps) {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
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
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary)"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Legend />
      </RechartsLineChart>
    </ChartContainer>
  );
}
