import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../shared/layouts/AuthLayout';
import { DashboardLayout } from '../../shared/layouts/DashboardLayout';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/pages/RegisterPage';
import { ProtectedRoute } from '../../modules/auth/components/ProtectedRoute';
import { PublicRoute } from '../../modules/auth/components/PublicRoute';
import { InventoryPage } from '../../modules/inventory/pages/InventoryPage';
import { CategoriesPage } from '../../modules/categories/pages/CategoriesPage';
import { ClientsPage } from '../../modules/clients/pages/ClientsPage';
import { EmployeesPage } from '../../modules/employees/pages/EmployeesPage';
import { SizesPage } from '../../modules/sizes/pages/SizesPage';
import { SupplierPage } from '../../modules/suppliers/pages/SuppliersPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      }>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Navigate to="/inventory" replace />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="suppliers" element={<SupplierPage />} />
        <Route path="sizes" element={<SizesPage />} />
      </Route>
    </Routes>
  );
}
