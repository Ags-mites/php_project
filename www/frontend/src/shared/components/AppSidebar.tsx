import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, Users, ShoppingCart, Settings, LogOut, Tags, Truck, Ruler } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type RootState } from '@/core/store/store';
import { logout } from '@/modules/auth/store/authSlice';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { title: 'Inventario', url: '/inventory', icon: Package, roles: ['Administrator', 'Supervisor'] },
  { title: 'Categorías', url: '/categories', icon: Tags, roles: ['Administrator', 'Supervisor'] },
  { title: 'Clientes', url: '/clients', icon: Users, roles: ['Administrator', 'Supervisor'] },
  { title: 'Empleados', url: '/employees', icon: Users, roles: ['Administrator'] },
  { title: 'Proveedores', url: '/suppliers', icon: Truck, roles: ['Administrator', 'Supervisor'] },
  { title: 'Tallas', url: '/sizes', icon: Ruler, roles: ['Administrator', 'Supervisor'] },
  { title: 'Ventas', url: '/sales', icon: ShoppingCart, roles: ['Administrator', 'Supervisor', 'Developer'] },
  { title: 'Configuración', url: '/settings', icon: Settings, roles: ['Administrator'] },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
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
          <span className="text-lg font-bold">Boutique</span>
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
