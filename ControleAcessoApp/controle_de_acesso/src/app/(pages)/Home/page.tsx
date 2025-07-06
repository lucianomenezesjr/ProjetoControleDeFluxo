"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/app/components/app-sidebar";
import { SiteHeader } from "@/app/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";
import LoaderSimple from "@/app/components/LoaderSimple";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";

interface User {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  ativo: boolean;
}

interface AccessRequest {
  id: number;
  alunoNome: string;
  requisicaoPor: string;
  status: string;
  motivo: string;
  dataSolicitacao: string;
  horarioEntradaOuSaida: string;
}

const chartConfig = {
  requests: {
    label: "Requests",
  },
  pendente: {
    label: "Pendente",
    color: "#FFD700",
  },
  aprovada: {
    label: "aprovada",
    color: "#4CAF50",
  },
  rejeitada: {
    label: "rejeitada",
    color: "#F44336",
  },
} satisfies ChartConfig;

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [timeRange, setTimeRange] = useState("90d");
  const router = useRouter();

  const chartData = React.useMemo(() => {
    const dataByDate: { 
      [key: string]: { 
        date: string; 
        pendente: number; 
        aprovada: number; 
        rejeitada: number 
      } 
    } = {};

    requests.forEach((request) => {
      const date = new Date(request.dataSolicitacao).toISOString().split("T")[0];
      if (!dataByDate[date]) {
        dataByDate[date] = { date, pendente: 0, aprovada: 0, rejeitada: 0 };
      }
      
      // Verifica se contém a palavra (case insensitive)
      const status = request.status.toLowerCase();
      
      if (status.includes("pendente")) {
        dataByDate[date].pendente += 1;
      } else if (status.includes("aprovada")) {
        dataByDate[date].aprovada += 1;
      } else if (status.includes("rejeitada")) {
        dataByDate[date].rejeitada += 1;
      }
    });

    return Object.values(dataByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [requests]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-06-29");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

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
      Promise.all([fetchUsers(storedToken), fetchRequests(storedToken)]).finally(() => setLoading(false));
    }
  }, [router]);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:7292/api/Usuarios", {
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
      //setTimeout(() => {
      //  router.push("/Login");
      //}, 5000);
    }
  };

  const fetchRequests = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:7292/api/RequisicaoDeAcesso", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não autorizado ou erro ao buscar requisições");
      }

      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar lista de requisições:", err);
      setError("Erro ao carregar a lista de requisições");
      setTimeout(() => {
        router.push("/Login");
      }, 5000);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:7292/api/Usuarios/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao apagar usuário");
      }

      setUsers(users.filter((user) => user.id !== userId));
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
      const response = await fetch(`http://127.0.0.1:7292/api/Usuarios/${updatedUser.id}`, {
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

      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      toast.success("Usuário atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 mx-5">
              <h1 className="text-2xl font-bold">Bem-vindo, {currentUser?.nome}</h1>
              <Card className="pt-0">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1">
                    <CardTitle>Requisições de acesso</CardTitle>
                    <CardDescription>
                      Mostrando as requisições de acesso
                    </CardDescription>
                  </div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                      className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                      aria-label="Select a value"
                    >
                      <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="90d" className="rounded-lg">
                        Last 3 months
                      </SelectItem>
                      <SelectItem value="30d" className="rounded-lg">
                        Last 30 days
                      </SelectItem>
                      <SelectItem value="7d" className="rounded-lg">
                        Last 7 days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[450px] w-full"
                  >
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient id="fillPendente" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#FFD700"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#FFD700"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="fillaprovada" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#4CAF50"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4CAF50"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="fillrejeitada" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#F44336"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F44336"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              });
                            }}
                            indicator="dot"
                          />
                        }
                      />
                      <Area
                        dataKey="pendente"
                        type="natural"
                        fill="url(#fillPendente)"
                        stroke="#FFD700"
                        stackId="a"
                      />
                      <Area
                        dataKey="aprovada"
                        type="natural"
                        fill="url(#fillaprovada)"
                        stroke="#4CAF50"
                        stackId="a"
                      />
                      <Area
                        dataKey="rejeitada"
                        type="natural"
                        fill="url(#fillrejeitada)"
                        stroke="#F44336"
                        stackId="a"
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}