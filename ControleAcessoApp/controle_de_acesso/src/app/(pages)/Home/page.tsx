'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoaderSimple from '@/app/components/LoaderSimple';
import Logo from '@/app/components/Logo';
import { Button } from '@/components/ui/button';


interface User {
  id: number;
  nome: string;
  funcao: string;
  email: string;
  ativo: boolean;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken) {
      router.replace('/');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }

    fetchUserData(storedToken);
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5274/api/Usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Não autorizado');
      }

      const users = await response.json();
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      const loggedInUser = users.find((u: User) => u.email === localUser.Email);

      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
      }

      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      setError('Erro ao carregar usuário');
      setLoading(false);
      router.push('/Login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/Login');
  };

  if (loading) return <div><LoaderSimple /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Right Section (User Info and Controls) */}
      <div className="w-full bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <Logo />
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Controle de Entrada e Saída</h1>
            {user && (
              <>
                <p className="text-lg text-gray-600">Bem-vindo, {user.nome}!</p>
                <p className="text-md text-gray-500">Função: {user.funcao}</p>
                <p className="text-md text-gray-500">Email: {user.email}</p>
                <p className="text-md text-gray-500">Status: {user.ativo ? 'Ativo' : 'Inativo'}</p>
              </>
            )}
            <div className="mt-6 space-y-4">
              <Button
                //onClick={handleRegisterEntry}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                Registrar Entrada
              </Button>
              <Button
                //onClick={handleRegisterExit}
                className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
              >
                Registrar Saída
              </Button>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

