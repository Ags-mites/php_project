import { Outlet, useLocation } from 'react-router-dom';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Menu, Home } from 'lucide-react';

const pathNames: Record<string, string> = {
  '/categorias': 'Categorías',
  '/proveedores': 'Proveedores',
  '/productos': 'Productos',
  '/importaciones': 'Importaciones',
  '/documentos': 'Documentos',
  '/pagos': 'Pagos',
  '/transportes': 'Transportes',
};

export function DashboardLayout() {
  const location = useLocation();
  const currentPage = pathNames[location.pathname] || 'Dashboard';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <button
              className="lg:hidden"
              onClick={() => {
                // Mobile toggle logic if needed
              }}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span className="font-medium text-foreground">{currentPage}</span>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
