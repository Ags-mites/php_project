import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from '../../shared/layouts/AuthLayout';
import { DashboardLayout } from '../../shared/layouts/DashboardLayout';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { RegisterPage } from '../../modules/auth/pages/RegisterPage';
import { LandingPage } from '../../modules/landing/pages/LandingPage';
import { ProtectedRoute } from '../../modules/auth/components/ProtectedRoute';
import { PublicRoute } from '../../modules/auth/components/PublicRoute';
import { CategoriesPage } from '../../modules/categories/pages/CategoriesPage';
import { SupplierPage } from '../../modules/suppliers/pages/SuppliersPage';
import { InventoryPage } from '../../modules/inventory/pages/InventoryPage';
import { ImportacionesPage } from '../../modules/importaciones/pages/ImportacionesPage';
import { DocumentosPage } from '../../modules/documentos/pages/DocumentosPage';
import { PagosPage } from '../../modules/pagos/pages/PagosPage';
import { TransportesPage } from '../../modules/transportes/pages/TransportesPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />

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
        <Route path="categorias" element={<CategoriesPage />} />
        <Route path="proveedores" element={<SupplierPage />} />
        <Route path="productos" element={<InventoryPage />} />
        <Route path="importaciones" element={<ImportacionesPage />} />
        <Route path="documentos" element={<DocumentosPage />} />
        <Route path="pagos" element={<PagosPage />} />
        <Route path="transportes" element={<TransportesPage />} />
      </Route>
    </Routes>
  );
}
