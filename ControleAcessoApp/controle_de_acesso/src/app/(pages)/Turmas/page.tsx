"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/app/components/app-sidebar";
import { DataTable } from "@/app/components/data-table-turmas";
import { SiteHeader } from "@/app/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import LoaderSimple from "@/app/components/LoaderSimple";
import { DropdownMenuTurma } from "@/app/components/DropdownTurma";

interface Turma {
  id: number;
  nome: string;
  ativo: boolean;
}

interface User {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  ativo: boolean;
}

export default function UsuariosPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
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
        if (!["coordenador", "diretor", "adm"].includes(user.funcao.toLowerCase())) {
          toast.error("Acesso negado. Apenas coordenadores, diretores ou administradores podem acessar esta página.");
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
      fetchTurmas(storedToken);
    }
  }, [router]);

  const fetchTurmas = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5274/api/Turma", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não autorizado ou erro ao buscar turmas");
      }

      const data = await response.json();
      setTurmas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar lista de turmas:", err);
      setError("Erro ao carregar a lista de turmas");
      setTimeout(() => {
        router.push("/Login");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTurma = async (turmaId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5274/api/Turma/${turmaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao apagar turma");
      }

      setTurmas(turmas.filter(turma => turma.id !== turmaId));
      toast.success("Turma apagada com sucesso");
    } catch (err) {
      console.error("Erro ao apagar turma:", err);
      toast.error("Erro ao apagar turma");
    }
  };

  const handleEditTurma = async (updatedTurma: Turma) => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      toast.error("Usuário não autenticado. Faça login novamente.");
      setTimeout(() => {
        router.push("/Login");
      }, 5000);
      throw new Error("Token inválido ou ausente");
    }

    if (!updatedTurma.nome.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5274/api/Turma/${updatedTurma.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedTurma.id,
          nome: updatedTurma.nome,
          ativo: updatedTurma.ativo,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao editar turma: ${errorText}`);
      }

      setTurmas(turmas.map(turma => turma.id === updatedTurma.id ? updatedTurma : turma));
      toast.success("Turma atualizada com sucesso");
    } catch (err) {
      console.error("Erro ao editar turma:", err);
      throw err;
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
              <h1 className="text-2xl font-bold">Lista de Turmas</h1>
              <DataTable data={turmas} onDeleteUser={handleDeleteTurma} onEditUser={handleEditTurma} />
              {turmas.length === 0 && (
                <p className="text-center mt-4">Nenhuma turma encontrada.</p>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}