"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/app/components/app-sidebar";
import { SiteHeader } from "@/app/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import LoaderSimple from "@/app/components/LoaderSimple";
import DataTable from "@/app/components/data-table-requisicoes";

interface RequisicaoAcesso {
  id: number;
  alunoId: number;
  alunoNome: string;
  requisicaoPor: string;
  status: string;
  motivo: string;
  dataSolicitacao: string;
  horarioEntradaOuSaida: string;
}

interface User {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  ativo: boolean;
}

export default function RequisicoesAcessoPage() {
  const [requisicoes, setRequisicoes] = useState<RequisicaoAcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser !== "undefined") {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        if (!["coordenador", "diretor", "adm", "professor"].includes(user.funcao.toLowerCase())) {
          toast.error("Acesso negado. Apenas coordenadores, diretores, professores ou administradores podem acessar esta página.");
          router.push("/Home");
          return;
        }
      } catch (e) {
        console.error("Erro ao parsear usuário do localStorage:", e);
        setError("Dados do usuário corrompidos");
        setLoading(false);
        return;
      }
    } else {
      setError("Usuário não autenticado");
      setLoading(false);
      router.push("/Home");
      return;
    }

    if (storedToken) {
      fetchRequisicoes(storedToken);
    }
  }, [router]);

  const fetchRequisicoes = async (token: string) => {
    try {
      const response = await fetch("http://localhost:7292/api/RequisicoesAcesso", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não autorizado ou erro ao buscar requisições de acesso");
      }

      const data = await response.json();
      setRequisicoes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar lista de requisições:", err);
      setError("Erro ao carregar a lista de requisições de acesso");
      setTimeout(() => {
        router.push("/Login");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requisicaoId: number, novoStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:7292/api/RequisicoesAcesso/${requisicaoId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: novoStatus
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status da requisição");
      }

      setRequisicoes(requisicoes.map(req => 
        req.id === requisicaoId ? { ...req, status: novoStatus } : req
      ));
      toast.success("Status da requisição atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast.error("Erro ao atualizar status da requisição");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderSimple />
      </div>
    );
  }

  if (error) {
    return <div className="text-center pt-10 text-red-500">{error}</div>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={currentUser} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 mx-5">
              <h1 className="text-2xl font-bold">Requisições de Acesso</h1>
              <DataTable 
                data={requisicoes} 
                onUpdateStatus={handleUpdateStatus} 
              />
              {requisicoes.length === 0 && (
                <p className="text-center mt-4">Nenhuma requisição encontrada.</p>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}