"use client";

import { useState, useEffect } from "react";
import { Invoice, Client } from "@/lib/types";
import {
  getInvoices,
  getClients,
  getClient,
  saveInvoice,
  updateInvoice,
  deleteInvoice,
  getTotalRevenue,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Plus, Edit, Trash2, X, Save, DollarSign } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    status: "pending" as "pending" | "paid" | "cancelled",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setInvoices(getInvoices());
    setClients(getClients());
    setTotalRevenue(getTotalRevenue());
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      status: "pending",
    });
    setEditingId(null);
    setError("");
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (invoice: Invoice) => {
    setFormData({
      clientId: invoice.clientId,
      date: invoice.date.split("T")[0],
      amount: invoice.amount.toString(),
      status: invoice.status,
    });
    setEditingId(invoice.id);
    setIsModalOpen(true);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!formData.clientId) {
      setError("Debes seleccionar un cliente");
      return;
    }
    if (!formData.date) {
      setError("La fecha es requerida");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }

    try {
      if (editingId) {
        const updated = updateInvoice(editingId, {
          clientId: formData.clientId,
          date: new Date(formData.date).toISOString(),
          amount: parseFloat(formData.amount),
          status: formData.status,
        });
        if (!updated) {
          setError("Error al actualizar la factura");
          return;
        }
      } else {
        saveInvoice({
          clientId: formData.clientId,
          date: new Date(formData.date).toISOString(),
          amount: parseFloat(formData.amount),
          status: formData.status,
        });
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      setError("Error al guardar la factura");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      const success = deleteInvoice(deleteConfirm);
      if (success) {
        loadData();
        setDeleteConfirm(null);
      }
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header con Revenue Card y Botón */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">Facturas</h1>
          <p className="text-muted-foreground">Gestiona tus facturas y pagos</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Revenue Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="size-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Total Revenue
              </span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <Button onClick={handleOpenModal}>
            <Plus className="size-4" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Editar Factura" : "Nueva Factura"}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="clientId">Cliente *</FieldLabel>
                  <select
                    id="clientId"
                    value={formData.clientId}
                    onChange={(e) =>
                      setFormData({ ...formData, clientId: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    required
                  >
                    <option value="">Selecciona un cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="date">Fecha *</FieldLabel>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="amount">Monto *</FieldLabel>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Estado *</FieldLabel>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "pending"
                          | "paid"
                          | "cancelled",
                      })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                    required
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </Field>

                {error && (
                  <FieldError className="bg-destructive/15 text-destructive rounded-md p-3">
                    {error}
                  </FieldError>
                )}

                <div className="flex gap-2 pt-2">
                  <Button type="submit">
                    <Save className="size-4" />
                    {editingId ? "Actualizar" : "Crear"} Factura
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {deleteConfirm && (
        <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
          <p className="font-medium mb-2">
            ¿Estás seguro de que deseas eliminar esta factura?
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Tabla de Facturas */}
      <div className="border rounded-lg overflow-hidden">
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay facturas registradas. Crea tu primera factura.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">
                    Invoice ID
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Cliente
                  </th>
                  <th className="text-left p-4 font-semibold text-sm">Fecha</th>
                  <th className="text-left p-4 font-semibold text-sm">Monto</th>
                  <th className="text-left p-4 font-semibold text-sm">
                    Estado
                  </th>
                  <th className="text-right p-4 font-semibold text-sm">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const client = getClient(invoice.clientId);
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm">
                        {invoice.number}
                      </td>
                      <td className="p-4">
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
                      <td className="p-4 text-sm">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="p-4 font-semibold">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="p-4">{getStatusBadge(invoice.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(invoice)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(invoice.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
