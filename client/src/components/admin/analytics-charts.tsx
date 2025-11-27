import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartDataPoint {
  name: string;
  views: number;
  previousViews?: number;
}

interface AnalyticsChartsProps {
  dailyData: ChartDataPoint[];
  weeklyData: ChartDataPoint[];
  monthlyData: ChartDataPoint[];
  billboardDistribution: { name: string; value: number }[];
}

const COLORS = ["hsl(152, 91%, 33%)", "hsl(45, 93%, 35%)", "hsl(210, 85%, 35%)", "hsl(280, 75%, 35%)", "hsl(15, 85%, 38%)"];

export function AnalyticsCharts({
  dailyData,
  weeklyData,
  monthlyData,
  billboardDistribution,
}: AnalyticsChartsProps) {
  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Views Trend</CardTitle>
            <CardDescription>Track billboard views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="daily" data-testid="tab-daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" data-testid="tab-monthly">Monthly</TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatNumber}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [formatNumber(value), "Views"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(152, 91%, 33%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(152, 91%, 33%)", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                      name="Current Period"
                    />
                    <Line
                      type="monotone"
                      dataKey="previousViews"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Previous Period"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="weekly" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatNumber}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [formatNumber(value), "Views"]}
                    />
                    <Bar
                      dataKey="views"
                      fill="hsl(152, 91%, 33%)"
                      radius={[4, 4, 0, 0]}
                      name="Views"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="monthly" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatNumber}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [formatNumber(value), "Views"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(152, 91%, 33%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(152, 91%, 33%)", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Billboards</CardTitle>
            <CardDescription>Views distribution by location</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={billboardDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name.substring(0, 10)}... (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {billboardDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatNumber(value), "Views"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Traffic Pattern</CardTitle>
          <CardDescription>Average views by hour of day</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={generateHourlyData()}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [formatNumber(value), "Avg Views"]}
              />
              <Bar
                dataKey="views"
                fill="hsl(152, 91%, 33%)"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function generateHourlyData() {
  const hours = [];
  for (let i = 6; i <= 22; i++) {
    const hour = i > 12 ? `${i - 12}PM` : i === 12 ? "12PM" : `${i}AM`;
    let views = 500;
    if (i >= 7 && i <= 9) views = 1500 + Math.random() * 500;
    else if (i >= 12 && i <= 14) views = 1800 + Math.random() * 400;
    else if (i >= 17 && i <= 19) views = 2000 + Math.random() * 600;
    else if (i >= 10 && i <= 16) views = 1000 + Math.random() * 300;
    else views = 600 + Math.random() * 200;
    hours.push({ hour, views: Math.round(views) });
  }
  return hours;
}
