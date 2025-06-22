"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { FuncoesUsuario } from "@/app/components/FuncoesUsuario";
import LoaderSimple from "@/app/components/LoaderSimple";

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== passwordConfirmation) {
      toast.error("As senhas não coincidem", { duration: 1500 });
      return;
    }

    try {
      const response = await fetch("http://localhost:5274/api/Usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, funcao, email, senhaHash: senha }),
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data); // Log para depuração

      if (response.ok) {
        toast.success(
          "Cadastro realizado com sucesso! Redirecionando para login...",
          { duration: 2000 }
        );
        setRedirecting(true);

        setTimeout(() => {
          router.push("/Login");
        }, 5000);
      } else {
        toast.error(data.message || "Erro ao realizar cadastro", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      toast.error("Erro na conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Right Section (Login Form) */}
      <div className="w-full flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] space-y-6">
          <Logo />
          {redirecting ? (
            <div className="text-center">
              <p className="text-lg mb-4">Redirecionando para o portal...</p>
              <LoaderSimple />
            </div>
          ) : (
            <>
              <h1 className="font-bold text-3xl text-center m-8">
                Bem-vindo ao Portal de controle de acesso
              </h1>
              <div className="text-center m-8 text-sm">
                Não tem conta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Cadastre-se
                </a>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Teste da silva jr"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <FuncoesUsuario value={funcao} onChange={setFuncao} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="exemplo@senai.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Senha</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Senha"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Confirmação de senha</Label>
                      </div>
                      <Input
                        id="passwordConfirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) =>
                          setPasswordConfirmation(e.target.value)
                        }
                        placeholder="Digite novamente a senha"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Entrar
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
