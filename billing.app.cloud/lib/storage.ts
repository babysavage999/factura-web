import { Client, Invoice } from "./types";

const CLIENTS_STORAGE_KEY = "billing-clients";
const INVOICES_STORAGE_KEY = "billing-invoices";

// Datos seedeados iniciales
const SEEDED_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1 234-567-8900",
    address: "123 Main St, New York, NY 10001",
    taxId: "12-3456789-0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Tech Solutions S.A.",
    email: "info@techsolutions.com",
    phone: "+34 912 345 678",
    address: "Calle Gran Vía 45, Madrid, 28013",
    taxId: "B12345678",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Global Services Ltd",
    email: "hello@globalservices.com",
    phone: "+44 20 1234 5678",
    address: "10 Downing Street, London, SW1A 2AA",
    taxId: "GB123456789",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Generar 3 facturas: una en el mes actual, una hace 1 mes, y una hace 2 meses
function generateSeededInvoices(): Invoice[] {
  const now = new Date();
  const invoices: Invoice[] = [];

  // Factura 1: Hace 2 meses
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10);
  invoices.push({
    id: "inv-1",
    clientId: "1",
    number: "INV-00001",
    date: twoMonthsAgo.toISOString(),
    amount: 4500.0,
    status: "paid",
    createdAt: twoMonthsAgo.toISOString(),
    updatedAt: twoMonthsAgo.toISOString(),
  });

  // Factura 2: Hace 1 mes
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  invoices.push({
    id: "inv-2",
    clientId: "2",
    number: "INV-00002",
    date: oneMonthAgo.toISOString(),
    amount: 5200.0,
    status: "paid",
    createdAt: oneMonthAgo.toISOString(),
    updatedAt: oneMonthAgo.toISOString(),
  });

  // Factura 3: Mes actual
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 5);
  invoices.push({
    id: "inv-3",
    clientId: "3",
    number: "INV-00003",
    date: currentMonth.toISOString(),
    amount: 3800.0,
    status: "paid",
    createdAt: currentMonth.toISOString(),
    updatedAt: currentMonth.toISOString(),
  });

  return invoices;
}

const SEEDED_INVOICES: Invoice[] = generateSeededInvoices();

// Inicializar storage con datos seedeados si no existen
function initializeStorage() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(CLIENTS_STORAGE_KEY)) {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(SEEDED_CLIENTS));
  }

  const existingInvoices = localStorage.getItem(INVOICES_STORAGE_KEY);
  if (!existingInvoices) {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(SEEDED_INVOICES));
  } else {
    // Si hay facturas existentes, verificar si son las antiguas (solo 3 facturas)
    // y reemplazarlas con los nuevos datos seedeados
    try {
      const invoices = JSON.parse(existingInvoices);
      // Si hay exactamente 3 facturas, probablemente son las antiguas seedeadas
      // Verificar si todas están en el mismo mes (indicador de datos antiguos)
      if (invoices.length === 3) {
        const dates = invoices.map((inv: Invoice) => {
          const date = new Date(inv.date);
          return `${date.getFullYear()}-${date.getMonth()}`;
        });
        const uniqueDates = new Set(dates);
        // Si todas las facturas están en el mismo mes, son datos antiguos - reemplazar
        if (uniqueDates.size === 1) {
          localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(SEEDED_INVOICES));
        }
      }
    } catch (e) {
      // Si hay error al parsear, reemplazar con datos seedeados
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(SEEDED_INVOICES));
    }
  }
}

// Función para resetear los datos seedeados (útil para desarrollo)
export function resetSeededData() {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(SEEDED_CLIENTS));
  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(SEEDED_INVOICES));
}

// Clientes
export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  initializeStorage();
  const data = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getClient(id: string): Client | null {
  const clients = getClients();
  return clients.find((c) => c.id === id) || null;
}

export function saveClient(client: Omit<Client, "id" | "createdAt" | "updatedAt">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  return newClient;
}

export function updateClient(id: string, client: Partial<Omit<Client, "id" | "createdAt">>): Client | null {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return null;

  clients[index] = {
    ...clients[index],
    ...client,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getClients();
  const filtered = clients.filter((c) => c.id !== id);
  if (filtered.length === clients.length) return false;
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Facturas
export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  initializeStorage();
  const data = localStorage.getItem(INVOICES_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getInvoicesByClientId(clientId: string): Invoice[] {
  const invoices = getInvoices();
  return invoices.filter((inv) => inv.clientId === clientId);
}

export function hasInvoices(clientId: string): boolean {
  return getInvoicesByClientId(clientId).length > 0;
}

// Generar número de factura consecutivo
function generateInvoiceNumber(): string {
  const invoices = getInvoices();
  if (invoices.length === 0) {
    return "INV-00001";
  }
  
  // Extraer el número más alto
  const numbers = invoices
    .map((inv) => {
      const match = inv.number.match(/INV-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);
  
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNumber = maxNumber + 1;
  
  return `INV-${nextNumber.toString().padStart(5, "0")}`;
}

export function saveInvoice(
  invoice: Omit<Invoice, "id" | "number" | "createdAt" | "updatedAt">
): Invoice {
  const invoices = getInvoices();
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv-${Date.now()}`,
    number: generateInvoiceNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  invoices.push(newInvoice);
  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  return newInvoice;
}

export function updateInvoice(
  id: string,
  invoice: Partial<Omit<Invoice, "id" | "number" | "createdAt">>
): Invoice | null {
  const invoices = getInvoices();
  const index = invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return null;

  invoices[index] = {
    ...invoices[index],
    ...invoice,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  return invoices[index];
}

export function deleteInvoice(id: string): boolean {
  const invoices = getInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  if (filtered.length === invoices.length) return false;
  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getInvoice(id: string): Invoice | null {
  const invoices = getInvoices();
  return invoices.find((inv) => inv.id === id) || null;
}

export function getTotalRevenue(): number {
  const invoices = getInvoices();
  return invoices
    .filter((inv) => inv.status === "paid")
    .reduce((total, inv) => total + inv.amount, 0);
}

