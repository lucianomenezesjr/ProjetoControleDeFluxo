'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5274/api/Usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Armazena o token no localStorage
        localStorage.setItem("token", data.Token);

        toast.success("Login realizado com sucesso!", { duration: 3000 });

        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error(data.message || "Erro ao fazer login", { duration: 3000 });
      }
    } catch (error) {
      toast.error("Erro na conexão com o servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      

      {/* Right Section (Login Form) */}
      <div className="w-full flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-[500px] space-y-6">
          <Image
            src="/senai_logo.png" // Caminho dentro da pasta "public"
            alt="Logo da empresa"
            width={4000}
            height={2000}
            className="p-8"
          />
          <h1 className="font-bold text-3xl text-center m-8">
            Bem-vindo ao
            Portal de controle de acesso
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
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>  
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}