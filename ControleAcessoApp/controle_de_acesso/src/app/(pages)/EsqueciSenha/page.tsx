'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import LoaderSimple from "@/app/components/LoaderSimple";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [redirecting, setRedirecting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5274/api/Usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data); // Log para depuração

      if (response.ok) {
        // ✅ Armazena o token e o usuário no localStorage
        localStorage.setItem("token", data.token); // Ajustado para 'token' em vez de 'Token'
        if (data.user && typeof data.user === "object") {
          localStorage.setItem("user", JSON.stringify(data.user)); // Ajustado para 'user' em vez de 'User'
        } else {
          console.error("Dados do usuário não encontrados na resposta:", data);
          toast.error("Erro: Dados do usuário não retornados pelo servidor");
          return;
        }
        toast.success("Login realizado com sucesso!", { duration: 2000 });
        setRedirecting(true);

        setTimeout(() => {
          router.push("/Home");
        }, 5000);
      } else {
        toast.error(data.message || "Erro ao fazer login", { duration: 3000 });
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      toast.error("Erro na conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
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
              Esqueceu a senha? 
            </h1>
            <h3 className="font-light text-xl text-center mr-16 ml-16">Informe um email e enviaremos um link para recuperação da sua senha.</h3>
            <div className="text-center m-8 text-sm">
              Não tem conta?{" "}
              <a href="/Cadastro" className="underline underline-offset-4">
                Cadastre-se
              </a>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-6">
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
                    <div className="flex">
                      <Label htmlFor="password">Senha</Label>
                      <a
                        href="/EsqueciSenha"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
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
                  <Button type="submit" className="w-full text-white">
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