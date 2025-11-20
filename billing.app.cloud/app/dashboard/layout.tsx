import { requireAuth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Billing App Cloud</h1>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </header>
      <nav className="border-b bg-muted/40">
        <div className="container mx-auto flex gap-4 px-4">
          <a
            href="/dashboard"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors hover:border-primary"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/clients"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors hover:border-primary"
          >
            Clientes
          </a>
          <a
            href="/dashboard/invoices"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors hover:border-primary"
          >
            Facturas
          </a>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

