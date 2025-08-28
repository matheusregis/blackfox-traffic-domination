import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { DashboardOverview } from "@/components/DashboardOverview";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <Header headerName="Dashboard" />
          <div className="p-6">
            <DashboardOverview />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
