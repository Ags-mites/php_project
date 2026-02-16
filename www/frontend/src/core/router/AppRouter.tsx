import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../shared/layouts/AuthLayout';
import { DashboardLayout } from '../../shared/layouts/DashboardLayout';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/pages/RegisterPage';
import { ProtectedRoute } from '../../modules/auth/components/ProtectedRoute';
import { PublicRoute } from '../../modules/auth/components/PublicRoute';
import { InventoryPage } from '../../modules/inventory/pages/InventoryPage';

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
      </Route>
    </Routes>
  );
}
