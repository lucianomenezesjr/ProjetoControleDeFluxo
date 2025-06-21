'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Logo from '@/app/components/Logo'

export default function Carregando(){

    const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/Login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);
    return(
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className="w-full flex items-center justify-center p-4">
                <div className="w-[500px] space-y-6">
                    <Logo />
                    <h1 className='font-bold text-3xl text-center m-8'>
                        Bem-vindo ao
                        Portal de controle de acesso
                    </h1>
                </div>
            </div>
        </div>
        
    )
}