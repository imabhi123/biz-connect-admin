import { Card, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AppWebsiteVisits({ title, subheader, chart }) {
  const { labels, series } = chart;

  // Transform data for Recharts
  const data = labels.map((label, index) => ({
    name: label,
    ...series.reduce((acc, cur) => {
      acc[cur.name] = cur.data[index];
      return acc;
    }, {}),
  }));

  return (
    <Card sx={{ padding: "16px", borderRadius: "8px", boxShadow: 3 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "16px" }}>
        {subheader}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {series.map((s) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
