import { type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../../core/store/store';
import { logout } from '../../../modules/auth/store/authSlice';

interface DashboardLayoutProps {
  children?: ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Inicio', roles: ['Admin', 'Supervisor', 'Vendedor'] },
  { path: '/inventory', label: 'Inventario', roles: ['Admin', 'Supervisor'] },
  { path: '/sales', label: 'Ventas', roles: ['Admin', 'Supervisor', 'Vendedor'] },
  { path: '/clients', label: 'Clientes', roles: ['Admin', 'Supervisor'] },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Boutique</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.username} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            {filteredNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 px-4 rounded ${
                  location.pathname === item.path
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
