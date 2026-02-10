'use client'

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Users, TrendingUp, Calendar, BookOpen } from 'lucide-react'

// Sample market data from database
const marketData = [
  { month: 'Jan', revenue: 35000, clients: 45, projects: 12, satisfaction: 85 },
  { month: 'Feb', revenue: 42000, clients: 52, projects: 15, satisfaction: 87 },
  { month: 'Mar', revenue: 38000, clients: 48, projects: 14, satisfaction: 84 },
  { month: 'Apr', revenue: 51000, clients: 62, projects: 18, satisfaction: 89 },
  { month: 'May', revenue: 55000, clients: 68, projects: 20, satisfaction: 90 },
  { month: 'Jun', revenue: 63000, clients: 75, projects: 22, satisfaction: 92 },
]

export function AdminDashboard() {
  const totalRevenue = marketData.reduce((sum, item) => sum + item.revenue, 0)
  const avgClients = Math.round(marketData.reduce((sum, item) => sum + item.clients, 0) / marketData.length)
  const totalProjects = marketData.reduce((sum, item) => sum + item.projects, 0)
  const avgSatisfaction = Math.round(marketData.reduce((sum, item) => sum + item.satisfaction, 0) / marketData.length)

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your consulting platform performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(totalRevenue / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 6 months
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgClients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average per month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed in 6 months
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Satisfaction Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSatisfaction}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue & Clients Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue & Client Growth</CardTitle>
              <CardDescription>
                Track revenue and client acquisition over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: 'Revenue (USD)',
                    color: 'hsl(var(--chart-1))',
                  },
                  clients: {
                    label: 'Clients',
                    color: 'hsl(var(--chart-2))',
                  },
                }}
                className="h-96"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={marketData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      name="Revenue"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="clients"
                      stroke="hsl(var(--chart-2))"
                      name="Clients"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Projects Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Projects Completed</CardTitle>
              <CardDescription>
                Monthly project completion rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  projects: {
                    label: 'Projects',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-72"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="projects"
                      fill="hsl(var(--chart-1))"
                      name="Projects"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Satisfaction Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Client Satisfaction</CardTitle>
              <CardDescription>
                Average satisfaction rating trend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  satisfaction: {
                    label: 'Satisfaction %',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-72"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="hsl(var(--chart-1))"
                      name="Satisfaction"
                      dot={{ fill: 'hsl(var(--chart-1))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
