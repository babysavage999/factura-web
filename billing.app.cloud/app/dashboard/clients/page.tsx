"use client";

import { useState, useEffect } from "react";
import { Client } from "@/lib/types";
import {
  getClients,
  saveClient,
  updateClient,
  deleteClient,
  hasInvoices,
  getInvoicesByClientId,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Trash2, Edit, Plus, X, Save } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setClients(getClients());
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      taxId: "",
    });
    setEditingId(null);
    setIsCreating(false);
    setError("");
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      taxId: client.taxId || "",
    });
    setEditingId(client.id);
    setIsCreating(false);
    setError("");
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!formData.email.trim()) {
      setError("El email es requerido");
      return;
    }
    if (!formData.phone.trim()) {
      setError("El teléfono es requerido");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("El email no es válido");
      return;
    }

    try {
      if (editingId) {
        const updated = updateClient(editingId, formData);
        if (!updated) {
          setError("Error al actualizar el cliente");
          return;
        }
      } else {
        saveClient(formData);
      }
      loadClients();
      resetForm();
    } catch (err) {
      setError("Error al guardar el cliente");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteError("");
    if (hasInvoices(id)) {
      const invoices = getInvoicesByClientId(id);
      setDeleteError(
        `No se puede eliminar este cliente porque tiene ${invoices.length} factura(s) asignada(s). Por favor, elimina las facturas primero.`
      );
      return;
    }
    setDeleteConfirm(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      const success = deleteClient(deleteConfirm);
      if (success) {
        loadClients();
        setDeleteConfirm(null);
        setDeleteError("");
      } else {
        setDeleteError("Error al eliminar el cliente");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
    setDeleteError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus clientes y su información
          </p>
        </div>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate}>
            <Plus className="size-4" />
            Nuevo Cliente
          </Button>
        )}
      </div>

      {/* Formulario de creación/edición */}
      {(isCreating || editingId) && (
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="size-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nombre *</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nombre del cliente"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email *</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="cliente@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Teléfono *</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 234-567-8900"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Dirección *</FieldLabel>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Dirección completa"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="taxId">RUC/NIT (Opcional)</FieldLabel>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData({ ...formData, taxId: e.target.value })
                  }
                  placeholder="Número de identificación tributaria"
                />
              </Field>

              {error && (
                <FieldError className="bg-destructive/15 text-destructive rounded-md p-3">
                  {error}
                </FieldError>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="submit">
                  <Save className="size-4" />
                  {editingId ? "Actualizar" : "Crear"} Cliente
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      )}

      {/* Mensaje de error al eliminar */}
      {deleteError && (
        <div className="bg-destructive/15 text-destructive border border-destructive/20 rounded-lg p-4">
          <p className="font-medium">No se puede eliminar</p>
          <p className="text-sm mt-1">{deleteError}</p>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {deleteConfirm && (
        <div className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
          <p className="font-medium mb-2">
            ¿Estás seguro de que deseas eliminar este cliente?
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="space-y-4">
        {clients.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">
              No hay clientes registrados. Crea tu primer cliente.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{client.name}</h3>
                      {hasInvoices(client.id) && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Tiene facturas
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {client.email}
                      </p>
                      <p>
                        <span className="font-medium">Teléfono:</span>{" "}
                        {client.phone}
                      </p>
                      <p>
                        <span className="font-medium">Dirección:</span>{" "}
                        {client.address}
                      </p>
                      {client.taxId && (
                        <p>
                          <span className="font-medium">RUC/NIT:</span>{" "}
                          {client.taxId}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isCreating && !editingId && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(client.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
