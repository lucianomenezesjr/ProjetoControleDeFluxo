'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo à Home</h1>
        <p className="text-lg text-gray-600">Olá, {user?.nome}!</p>
        <p className="text-md text-gray-500">Função: {user?.funcao}</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

