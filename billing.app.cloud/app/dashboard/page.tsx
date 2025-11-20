"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateDashboardMetrics } from "@/lib/dashboard";
import { Invoice } from "@/lib/types";
import { getClient } from "@/lib/storage";
import {
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  Pagadas: {
    label: "Pagadas",
    color: "hsl(142, 76%, 36%)",
  },
  Pendientes: {
    label: "Pendientes",
    color: "hsl(45, 93%, 47%)",
  },
  Canceladas: {
    label: "Canceladas",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig;

const clientsChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<ReturnType<
    typeof calculateDashboardMetrics
  > | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    setMounted(true);
    setMetrics(calculateDashboardMetrics());

    // Recargar métricas cuando cambien los datos
    const interval = setInterval(() => {
      setMetrics(calculateDashboardMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-green-500/10 text-green-700 dark:text-green-400",
      pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
    };
    const labels = {
      paid: "Pagada",
      pending: "Pendiente",
      cancelled: "Cancelada",
    };
    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // Mostrar loading mientras se monta el componente
  if (!mounted || !metrics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen general de tu negocio
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general de tu negocio
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <DollarSign className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ingresos totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Facturas
            </CardTitle>
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <FileText className="size-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Facturas emitidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <Users className="size-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Clientes activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio Factura
            </CardTitle>
            <div className="bg-green-500/10 p-2 rounded-lg">
              <TrendingUp className="size-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.averageInvoiceAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Por factura</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-5 text-green-500" />
              <CardTitle className="text-base font-semibold">Pagadas</CardTitle>
            </div>
            <span className="text-2xl font-bold text-green-500">
              {metrics.paidInvoices}
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(
                metrics.invoicesByStatus.find((s) => s.status === "Pagadas")
                  ?.amount || 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-yellow-500" />
              <CardTitle className="text-base font-semibold">
                Pendientes
              </CardTitle>
            </div>
            <span className="text-2xl font-bold text-yellow-500">
              {metrics.pendingInvoices}
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(
                metrics.invoicesByStatus.find((s) => s.status === "Pendientes")
                  ?.amount || 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <XCircle className="size-5 text-red-500" />
              <CardTitle className="text-base font-semibold">
                Canceladas
              </CardTitle>
            </div>
            <span className="text-2xl font-bold text-red-500">
              {metrics.cancelledInvoices}
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(
                metrics.invoicesByStatus.find((s) => s.status === "Canceladas")
                  ?.amount || 0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue por Mes</CardTitle>
            <CardDescription>Ingresos de los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig}>
              <AreaChart data={metrics.revenueByMonth}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip
                  cursor={{ stroke: "var(--color-revenue)", strokeWidth: 1 }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={3}
                  fill="url(#fillRevenue)"
                  dot={{
                    fill: "var(--color-revenue)",
                    r: 4,
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: "hsl(var(--background))",
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Invoices by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
            <CardDescription>Facturas por estado de pago</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={statusChartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={metrics.invoicesByStatus}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={100}
                  strokeWidth={3}
                  stroke="hsl(var(--background))"
                >
                  {metrics.invoicesByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.status === "Pagadas"
                          ? "hsl(142, 76%, 36%)"
                          : entry.status === "Pendientes"
                          ? "hsl(45, 93%, 47%)"
                          : "hsl(0, 84%, 60%)"
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-4 mt-4">
              {metrics.invoicesByStatus.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{
                      backgroundColor:
                        entry.status === "Pagadas"
                          ? "hsl(142, 76%, 36%)"
                          : entry.status === "Pendientes"
                          ? "hsl(45, 93%, 47%)"
                          : "hsl(0, 84%, 60%)",
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clientes por Revenue</CardTitle>
          <CardDescription>
            Los 5 clientes con mayor facturación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={clientsChartConfig}>
            <BarChart data={metrics.invoicesByClient}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="clientName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value / 1000}k`}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[8, 8, 0, 0]}
                stroke="var(--color-revenue)"
                strokeWidth={1}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Recientes</CardTitle>
          <CardDescription>Últimas 5 facturas creadas</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay facturas recientes
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-3 font-semibold text-sm">
                      Invoice ID
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Cliente
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Fecha
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Monto
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentInvoices.map((invoice) => {
                    const client = getClient(invoice.clientId);
                    return (
                      <tr
                        key={invoice.id}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 font-mono text-sm">
                          {invoice.number}
                        </td>
                        <td className="p-3">
                          {client ? (
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {client.email}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Cliente no encontrado
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="p-3 font-semibold">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="p-3">
                          {getStatusBadge(invoice.status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
