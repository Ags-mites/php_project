import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { AuthLayout } from '../../shared/components/layouts/AuthLayout';
import { DashboardLayout } from '../../shared/components/layouts/DashboardLayout';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/pages/RegisterPage';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function DashboardPage() {
  return <div>Dashboard</div>;
}

function InventoryPage() {
  return <div>Inventario</div>;
}

function SalesPage() {
  return <div>Ventas</div>;
}

function ClientsPage() {
  return <div>Clientes</div>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthLayout>
        <RedirectIfAuthenticated>
          <LoginPage />
        </RedirectIfAuthenticated>
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <RedirectIfAuthenticated>
          <RegisterPage />
        </RedirectIfAuthenticated>
      </AuthLayout>
    ),
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventory',
        element: (
          <ProtectedRoute allowedRoles={['Admin', 'Supervisor']}>
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sales',
        element: (
          <ProtectedRoute>
            <SalesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'clients',
        element: (
          <ProtectedRoute allowedRoles={['Admin', 'Supervisor']}>
            <ClientsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
