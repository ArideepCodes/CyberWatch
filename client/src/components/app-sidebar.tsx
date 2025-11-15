import { Link, useLocation } from "wouter";
import { Shield, LayoutDashboard, AlertTriangle, Brain, Search, BarChart3 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    testId: "nav-dashboard",
  },
  {
    title: "Threats",
    url: "/threats",
    icon: AlertTriangle,
    testId: "nav-threats",
  },
  {
    title: "AI Insights",
    url: "/ai-insights",
    icon: Brain,
    testId: "nav-ai-insights",
  },
  {
    title: "IP Lookup",
    url: "/ip-lookup",
    icon: Search,
    testId: "nav-ip-lookup",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    testId: "nav-analytics",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/30">
            <Shield className="h-5 w-5 text-primary" style={{ filter: "drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))" }} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">CyberWatch</span>
            <span className="text-xs text-muted-foreground">Threat Hunter</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={item.testId}>
                      <Link href={item.url}>
                        <item.icon className={isActive ? "text-primary" : ""} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
