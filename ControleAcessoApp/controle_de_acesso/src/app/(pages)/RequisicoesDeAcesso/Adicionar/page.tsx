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
import { TimePickerDemo } from "@/components/ui/time-picker-demo";

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
  const [horarioEntradaOuSaida, setHorarioEntradaOuSaida] = useState<Date | undefined>(undefined);
  const [showCustomMotivo, setShowCustomMotivo] = useState(false);

  const motivosPadroes = [
    "Consulta médica",
    "Problemas familiares",
    "Atividade extracurricular",
    "Problemas de transporte",
    "Outros",
  ];

  // Função para formatar a data/hora no fuso horário local (-03:00)
  const formatLocalDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (!currentUser.nome) {
      toast.error("Nome do usuário não encontrado");
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

    if (motivo === "Outros" && !motivoCustomizado.trim()) {
      toast.error("Especifique o motivo personalizado");
      return;
    }

    if (!horarioEntradaOuSaida) {
      toast.error("Informe o horário de entrada/saída");
      return;
    }

    const motivoFinal = motivo === "Outros" ? motivoCustomizado : motivo;
    const currentDateSolicitation = new Date();
    let dataSolicitacao = formatLocalDateTime(currentDateSolicitation);

    // Format horario_entrada_ou_saida no fuso horário local
    let horario;
    try {
      // Combinar a data atual com o horário selecionado
      const currentDate = new Date();
      const selectedTime = new Date(horarioEntradaOuSaida);
      currentDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
      );
      horario = formatLocalDateTime(currentDate); // Formato YYYY-MM-DD HH:mm:ss
      if (isNaN(currentDate.getTime())) {
        throw new Error("Invalid time");
      }
    } catch (error) {
      toast.error("Formato de horário inválido");
      return;
    }

    // Encontrar o aluno selecionado com base no alunoId
    const alunoSelecionado = alunos.find((aluno) => aluno.id === alunoId);
    if (!alunoSelecionado) {
      toast.error("Aluno selecionado não encontrado");
      return;
    }

    const payload = {
      alunoNome: alunoSelecionado.nome,
      requisicaoPor: currentUser.nome,
      status: "pendente",
      motivo: motivoFinal,
      dataSolicitacao,
      horarioEntradaOuSaida: horario,
    };
    console.log("Payload:", payload);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token de autenticação não encontrado");
        return;
      }

      const response = await fetch("http://127.0.0.1:7292/api/RequisicaoDeAcesso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response:", data, "Status:", response.status);

      if (response.ok) {
        toast.success("Requisição cadastrada com sucesso!", { duration: 2000 });
        // Reset form
        setAlunoId(null);
        setMotivo("");
        setMotivoCustomizado("");
        setHorarioEntradaOuSaida(undefined);
        setShowCustomMotivo(false);
      } else {
        const errorMessage = data.errors
          ? Object.values(data.errors).flat().join("; ")
          : data.message || data.title || "Erro ao cadastrar requisição";
        toast.error(errorMessage, { duration: 3000 });
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      toast.error(`Erro na conexão com o servidor: ${error}`);
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
        if (!storedToken) {
          throw new Error("Token de autenticação não encontrado");
        }
        const response = await fetch("http://127.0.0.1:7292/api/Alunos", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar alunos: ${response.statusText}`);
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
                        onValueChange={(value) => setAlunoId(value ? Number(value) : null)}
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
                          if (value !== "Outros") {
                            setMotivoCustomizado("");
                          }
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
                      <TimePickerDemo
                        date={horarioEntradaOuSaida}
                        setDate={setHorarioEntradaOuSaida}
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