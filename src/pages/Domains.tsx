import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { DomainsOverview } from "@/components/DomainOverview";
import { useUser } from "@/contexts/UserContext";

export type Domain = {
  _id: string;
  name: string;
  whiteUrl: string;
  blackUrl: string;
};
const API_URL = import.meta.env.VITE_API_URL;
export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const { user } = useUser();

  const userId = user?.userId;
  const fetchDomains = async () => {
    try {
      const response = await axios.get(`${API_URL}/domains/${userId}`);
      setDomains(response.data);
    } catch (err) {
      toast.error("Erro ao carregar domínios");
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <Header headerName="Gerenciar Domínios" />
          <div className="p-6">
            <DomainsOverview domains={domains} onRefresh={fetchDomains} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
