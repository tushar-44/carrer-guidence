"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface ChartComponentProps {
  data: Array<{
    skill: string;
    score: number;
  }>;
}

export default function ChartComponent({ data }: ChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#00F0C5"
          fill="#00F0C5"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}