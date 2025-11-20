import { Invoice, Client } from "./types";
import { getInvoices, getClients } from "./storage";

export interface DashboardMetrics {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  cancelledInvoices: number;
  totalClients: number;
  averageInvoiceAmount: number;
  revenueByMonth: Array<{ month: string; revenue: number; count: number }>;
  invoicesByClient: Array<{ clientName: string; count: number; revenue: number }>;
  invoicesByStatus: Array<{ status: string; count: number; amount: number }>;
  recentInvoices: Invoice[];
}

export function calculateDashboardMetrics(): DashboardMetrics {
  const invoices = getInvoices();
  const clients = getClients();

  // Métricas básicas
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending").length;
  const cancelledInvoices = invoices.filter((inv) => inv.status === "cancelled").length;
  const totalClients = clients.length;

  const averageInvoiceAmount =
    invoices.length > 0
      ? invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length
      : 0;

  // Revenue por mes (últimos 6 meses)
  const revenueByMonth: { [key: string]: { revenue: number; count: number } } = {};
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString("es-ES", { year: "numeric", month: "short" });
    revenueByMonth[monthKey] = { revenue: 0, count: 0 };
  }

  invoices
    .filter((inv) => inv.status === "paid")
    .forEach((inv) => {
      const date = new Date(inv.date);
      const monthKey = date.toLocaleDateString("es-ES", { year: "numeric", month: "short" });
      if (revenueByMonth[monthKey]) {
        revenueByMonth[monthKey].revenue += inv.amount;
        revenueByMonth[monthKey].count += 1;
      }
    });

  // Facturas por cliente
  const invoicesByClientMap: { [key: string]: { count: number; revenue: number } } = {};
  invoices.forEach((inv) => {
    const client = clients.find((c) => c.id === inv.clientId);
    const clientName = client?.name || "Cliente desconocido";
    if (!invoicesByClientMap[clientName]) {
      invoicesByClientMap[clientName] = { count: 0, revenue: 0 };
    }
    invoicesByClientMap[clientName].count += 1;
    if (inv.status === "paid") {
      invoicesByClientMap[clientName].revenue += inv.amount;
    }
  });

  const invoicesByClient = Object.entries(invoicesByClientMap)
    .map(([clientName, data]) => ({
      clientName,
      count: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Top 5 clientes

  // Facturas por estado
  const invoicesByStatus = [
    {
      status: "Pagadas",
      count: paidInvoices,
      amount: invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0),
    },
    {
      status: "Pendientes",
      count: pendingInvoices,
      amount: invoices
        .filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + inv.amount, 0),
    },
    {
      status: "Canceladas",
      count: cancelledInvoices,
      amount: invoices
        .filter((inv) => inv.status === "cancelled")
        .reduce((sum, inv) => sum + inv.amount, 0),
    },
  ];

  // Facturas recientes (últimas 5)
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalRevenue,
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    cancelledInvoices,
    totalClients,
    averageInvoiceAmount,
    revenueByMonth: Object.entries(revenueByMonth).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      count: data.count,
    })),
    invoicesByClient,
    invoicesByStatus,
    recentInvoices,
  };
}

