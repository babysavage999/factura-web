export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string; // RUC/NIT
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  number: string;
  date: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

