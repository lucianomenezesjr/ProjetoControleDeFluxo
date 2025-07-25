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
  alunoId: number | null;
  alunoNome: string | null;
  requisicaoPor: string | null;
  status: string;
  motivo: string | null;
  dataSolicitacao: string | null;
  horarioEntradaOuSaida: string | null;
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
      const response = await fetch("http://127.0.0.1:7292/api/RequisicaoDeAcesso", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.title || `Erro ao buscar requisições: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched requisicoes:", data); // Debug
      // Ensure nomeAluno is set to 'Desconhecido' if missing
      const normalizedData = Array.isArray(data) ? data.map(item => ({
        ...item,
        alunoNome: item.alunoNome || "Desconhecido",
      })) : [];
      setRequisicoes(normalizedData);
    } catch (err) {
      console.error("Erro ao buscar lista de requisições:", err);
      toast.error(error || "Erro ao carregar a lista de requisições de acesso", { duration: 5000 });
      setError(error || "Erro ao carregar a lista de requisições de acesso");
      setTimeout(() => {
        router.push("/Login");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

const handleUpdateStatus = async (requisicaoId: number, novoStatus: string) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  
  if (!token) return toast.error("Token não encontrado");

  try {
    const statusFormatado = `${novoStatus.toLowerCase()} por ${user.nome}`;
    
    const response = await fetch(`http://127.0.0.1:7292/api/RequisicaoDeAcesso/${requisicaoId}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: statusFormatado })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro na requisição");
    }

    // Atualiza o estado local
    setRequisicoes(prev => prev.map(req => 
      req.id === requisicaoId ? { ...req, status: statusFormatado } : req
    ));

    toast.success("Status atualizado!");
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Falha ao atualizar");
    console.error("Erro:", err);
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