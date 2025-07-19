import { BarChart3, Settings, Shield, Zap, Globe, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import blackfoxLogo from "@/assets/blackfox-logo.png";

const items = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
  { title: "Campanhas", url: "/dashboard/campaigns", icon: Zap },
  { title: "Gerenciar Domínios", url: "/dashboard/dns", icon: Globe },
  { title: "Regras de Proteção", url: "/dashboard/rules", icon: Shield },
  { title: "Relatórios", url: "/dashboard/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium hover:bg-primary/30" 
      : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r border-primary/20 bg-card/30`}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <img src={blackfoxLogo} alt="BlackFox" className="w-8 h-8" />
            {!collapsed && (
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cloaker Guard
              </span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto p-4 border-t border-primary/20">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/dashboard/settings" 
                  className={getNavCls}
                >
                  <Settings className="h-4 w-4" />
                  {!collapsed && <span>Configurações</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}