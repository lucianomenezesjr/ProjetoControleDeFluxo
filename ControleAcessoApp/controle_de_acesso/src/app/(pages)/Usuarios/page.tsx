"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/app/components/app-sidebar";
import { DataTable } from "@/app/components/data-table";
import { SiteHeader } from "@/app/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import LoaderSimple from "@/app/components/LoaderSimple";
import { DropdownMenuTurma } from "@/app/components/DropdownTurma";

interface User {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  ativo: boolean;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
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
      fetchUsers(storedToken);
    }
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch("http://jr-notebook:7292/api/Usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não autorizado ou erro ao buscar usuários");

      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar lista de usuários:", err);
      setError("Erro ao carregar a lista de usuários");
      setTimeout(() => {
          router.push("/Login");
        }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(`http://jr-notebook:7292/api/Usuarios/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao apagar usuário");
      }

      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuário apagado com sucesso");
    } catch (err) {
      console.error("Erro ao apagar usuário:", err);
      toast.error("Erro ao apagar usuário");
    }
  };

  const handleEditUser = async (updatedUser: User) => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      toast.error("Usuário não autenticado. Faça login novamente.");
      setTimeout(() => {
          router.push("/Login");
        }, 5000);
      throw new Error("Token inválido ou ausente");
    }

    if (!updatedUser.nome.trim()) {
      toast.error("Nome é obrigatório.");
      return;
    }
    if (!updatedUser.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedUser.email)) {
      toast.error("Email inválido.");
      return;
    }
    if (!updatedUser.funcao.trim()) {
      toast.error("Função é obrigatória.");
      return;
    }
    const validFuncoes = ["porteiro", "diretor", "coordenador", "opp", "aqv", "bibliotecaria", "docente"];
    if (!validFuncoes.includes(updatedUser.funcao.toLowerCase())) {
      toast.error("Função inválida. Use 'porteiro', 'diretor', 'coordenador', 'opp', 'aqv', 'bibliotecaria' ou 'docente'.");
      return;
    }

    try {
      const response = await fetch(`http://jr-notebook:7292/api/Usuarios/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedUser.id,
          nome: updatedUser.nome,
          funcao: updatedUser.funcao,
          email: updatedUser.email,
          ativo: updatedUser.ativo,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao editar usuário: ${errorText}`);
      }

      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      toast.success("Usuário atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
      //toast.error(`Erro ao editar usuário: ${err.message}`);
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
              <h1 className="text-2xl font-bold">Lista de Usuários</h1>
              
              <DataTable data={users} onDeleteUser={handleDeleteUser} onEditUser={handleEditUser} />
              {users.length === 0 && (
                <p className="text-center mt-4">Nenhum usuário encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}