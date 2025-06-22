"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/app/components/app-sidebar";
import { SiteHeader } from "@/app/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import LoaderSimple from "@/app/components/LoaderSimple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Aluno {
  id: number;
  nome: string;
}

interface User {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  ativo: boolean;
}

export default function RequisicoesAdicionarPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const router = useRouter();
  
  // Form state
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState("");
  const [motivoCustomizado, setMotivoCustomizado] = useState("");
  const [horarioEntradaOuSaida, setHorarioEntradaOuSaida] = useState("");
  const [showCustomMotivo, setShowCustomMotivo] = useState(false);

  const motivosPadroes = [
    "Consulta médica",
    "Problemas familiares",
    "Atividade extracurricular",
    "Problemas de transporte",
    "Outros"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (!alunoId) {
      toast.error("Selecione um aluno");
      return;
    }

    if (!motivo) {
      toast.error("Selecione ou informe um motivo");
      return;
    }

    if (!horarioEntradaOuSaida) {
      toast.error("Informe o horário de entrada/saída");
      return;
    }

    const motivoFinal = motivo === "Outros" ? motivoCustomizado : motivo;
    const dataSolicitacao = new Date().toISOString(); // Data e hora atuais

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5274/api/RequisicoesAcesso", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          alunoId,
          requisicaoPor: currentUser.id,
          status: "pendente",
          motivo: motivoFinal,
          dataSolicitacao, // Data preenchida automaticamente
          horarioEntradaOuSaida: new Date(horarioEntradaOuSaida).toISOString()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Requisição cadastrada com sucesso!", { duration: 2000 });
        // Reset form
        setAlunoId(null);
        setMotivo("");
        setMotivoCustomizado("");
        setHorarioEntradaOuSaida("");
        setShowCustomMotivo(false);
      } else {
        toast.error(data.message || "Erro ao cadastrar requisição", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      toast.error("Erro na conexão com o servidor");
    }
  };

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

    // Fetch alunos
    const fetchAlunos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5274/api/Alunos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar alunos");
        }

        const data = await response.json();
        setAlunos(data);
      } catch (err) {
        console.error("Erro ao buscar alunos:", err);
        toast.error("Erro ao carregar lista de alunos");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, [router]);

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
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 mx-5 justify-center items-center">
              <h1 className="text-2xl font-bold">Criar nova requisição de acesso</h1>
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-6">
                    {/* Aluno Dropdown */}
                    <div className="grid gap-3">
                      <Label htmlFor="aluno">Aluno</Label>
                      <Select
                        value={alunoId?.toString() || ""}
                        onValueChange={(value) => setAlunoId(Number(value))}
                        required
                      >
                        <SelectTrigger id="aluno">
                          <SelectValue placeholder="Selecione um aluno" />
                        </SelectTrigger>
                        <SelectContent>
                          {alunos.map((aluno) => (
                            <SelectItem key={aluno.id} value={aluno.id.toString()}>
                              {aluno.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Motivo Dropdown */}
                    <div className="grid gap-3">
                      <Label htmlFor="motivo">Motivo</Label>
                      <Select
                        value={motivo}
                        onValueChange={(value) => {
                          setMotivo(value);
                          setShowCustomMotivo(value === "Outros");
                        }}
                        required
                      >
                        <SelectTrigger id="motivo">
                          <SelectValue placeholder="Selecione um motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {motivosPadroes.map((motivo) => (
                            <SelectItem key={motivo} value={motivo}>
                              {motivo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {showCustomMotivo && (
                        <div className="mt-2 grid gap-3">
                          <Label htmlFor="motivoCustomizado">Especifique o motivo</Label>
                          <Input
                            id="motivoCustomizado"
                            type="text"
                            placeholder="Digite o motivo"
                            value={motivoCustomizado}
                            onChange={(e) => setMotivoCustomizado(e.target.value)}
                            required={showCustomMotivo}
                          />
                        </div>
                      )}
                    </div>

                    {/* Horário */}
                    <div className="grid gap-3">
                      <Label htmlFor="horario">Horário de entrada/saída</Label>
                      <Input
                        id="horario"
                        type="datetime-local"
                        value={horarioEntradaOuSaida}
                        onChange={(e) => setHorarioEntradaOuSaida(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Enviar requisição
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}