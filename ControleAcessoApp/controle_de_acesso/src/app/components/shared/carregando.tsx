'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Logo from '@/app/components/Logo'
import LoaderSimple from '../LoaderSimple';


export default function Carregando(){

    const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/Login');
    }, 2000);

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
                    <LoaderSimple/>
                </div>
            </div>
        </div>
        
    )
}