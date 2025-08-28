import {
  BarChart3,
  Settings,
  Shield,
  Zap,
  Globe,
  Home,
  CreditCard,
} from "lucide-react";
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
  { title: "Planos", url: "/pricing", icon: CreditCard }, // ⬅️ novo
];

// CSS variables do shadcn/sidebar — forçamos o dark aqui
const SIDEBAR_DARK_VARS: React.CSSProperties = {
  // fundo e texto
  ["--sidebar-background" as any]: "#0b0d14", // quase-preto
  ["--sidebar-foreground" as any]: "222.2 84% 96%", // hsl var scale (shadcn usa <number> <number>% <number>%)
  // cores de borda/realce
  ["--sidebar-border" as any]: "rgba(255,255,255,.08)",
  ["--sidebar-ring" as any]: "262 83% 58%",
  // cores de ação
  ["--sidebar-primary" as any]: "262 83% 58%",
  ["--sidebar-primary-foreground" as any]: "0 0% 100%",
  ["--sidebar-accent" as any]: "0 0% 13%", // hover bg
  ["--sidebar-accent-foreground" as any]: "222.2 84% 96%",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const base =
    "group flex w-full items-center gap-3 rounded-md px-2 py-2 transition-colors";
  const active =
    "bg-primary/10 text-foreground border border-primary/30 ring-1 ring-primary/20";
  const inactive =
    "text-muted-foreground hover:bg-primary/10 hover:text-foreground";

  return (
    <Sidebar
      collapsible="icon"
      style={SIDEBAR_DARK_VARS}
      className={`${
        collapsed ? "w-14" : "w-64"
      } border-r border-primary/20 bg-black/10`}
    >
      <SidebarContent>
        {/* Topo / Logo com borda roxa */}
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
          <SidebarGroupLabel
            className={collapsed ? "hidden" : "text-xs text-primary/70"}
          >
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
                      className={({ isActive }) =>
                        `${base} ${isActive ? active : inactive}`
                      }
                    >
                      <item.icon className="h-4 w-4 text-primary/70 group-hover:text-primary" />
                      {!collapsed && (
                        <span className="text-white">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rodapé com borda roxa */}
        <div className="mt-auto p-4 border-t border-primary/20">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/dashboard/settings"
                  className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                  }
                >
                  <Settings className="h-4 w-4 text-primary/70 group-hover:text-primary" />
                  {!collapsed && (
                    <span className="text-white">Configurações</span>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
