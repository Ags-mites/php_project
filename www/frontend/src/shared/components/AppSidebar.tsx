import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Package, Tags, Truck, FileText, CreditCard, Plane, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppSelector, useAppDispatch } from '@/core/store/hooks';
import { logout } from '@/modules/auth/store/authSlice';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Categorías', url: '/categorias', icon: Tags, roles: ['Administrador', 'Supervisor', 'Desarrollador'] },
  { title: 'Proveedores', url: '/proveedores', icon: Truck, roles: ['Administrador', 'Supervisor', 'Desarrollador'] },
  { title: 'Productos', url: '/productos', icon: Package, roles: ['Administrador', 'Supervisor', 'Desarrollador'] },
  { title: 'Importaciones', url: '/importaciones', icon: Plane, roles: ['Administrador', 'Supervisor', 'Desarrollador'] },
  { title: 'Documentos', url: '/documentos', icon: FileText, roles: ['Administrador', 'Supervisor', 'Desarrollador'] },
  { title: 'Pagos', url: '/pagos', icon: CreditCard, roles: ['Administrador', 'Supervisor', 'Desarrollador'] },
  { title: 'Transportes', url: '/transportes', icon: Truck, roles: ['Administrador', 'Supervisor', 'Desarrollador'] },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles?.includes(user.role)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <span className="text-lg font-bold">Importaciones</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.username}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
