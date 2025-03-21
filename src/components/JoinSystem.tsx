import React, { useState, useEffect } from 'react';
import { CheckCircle, Copy, Check, Loader2, Users, Settings } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { useStats } from '../hooks/useStats';
import ChangePassword from './ChangePassword';

export default function JoinSystem() {
  const { totalUsers, loading: statsLoading } = useStats();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserEmail(session?.user?.email || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Добродошли у Заплање-коин
        </h2>
        
        <p className="text-gray-300 mb-4 text-center">
          Креирајте налог или се пријавите да бисте користили Заплање-коин
        </p>

        {!statsLoading && totalUsers !== null && (
          <div className="mb-8 flex items-center justify-center space-x-2 text-gray-300">
            <Users className="h-5 w-5" />
            <span>Тренутно придружено: {totalUsers} корисника</span>
          </div>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#8B4513',
                  brandAccent: '#654321',
                }
              }
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Имејл адреса',
                password_label: 'Лозинка',
                button_label: 'Пријави се',
                loading_button_label: 'Пријављивање...',
                link_text: 'Већ имате налог? Пријавите се',
              },
              sign_up: {
                email_label: 'Имејл адреса',
                password_label: 'Лозинка',
                button_label: 'Креирај налог',
                loading_button_label: 'Креирање налога...',
                link_text: 'Немате налог? Региструјте се',
              },
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-white">
            Добродошли у Заплање-коин
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showSettings 
                ? 'bg-purple-500 text-white' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
            title="Подешавања налога"
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Подешавања</span>
          </button>
        </div>
        
        <p className="text-gray-300 mb-8">
          Заплање-коин је децентрализована дигитална валута намењена локалној заједници.
        </p>

        {!statsLoading && totalUsers !== null && (
          <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center space-x-2">
            <Users className="h-5 w-5 text-purple-400" />
            <span className="text-gray-300">Тренутно придружено: <span className="text-purple-400 font-semibold">{totalUsers}</span> корисника</span>
          </div>
        )}

        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-white mb-4">Сигурност</h3>
            <p className="text-gray-300">
              Ваш новчаник је јединствен и сигуран. Сачувајте адресу вашег новчаника на сигурном месту. 
              Све трансакције су трајно забележене у блокчејну и не могу се изменити.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4">Следећи кораци</h3>
            <div className="space-y-4">
              <StepItem>Идите на страницу "Новчаник" да видите вашу адресу</StepItem>
              <StepItem>Започните рударење да зарадите ваше прве Заплање-коине</StepItem>
              <StepItem>Пошаљите Заплање-коине другим корисницима</StepItem>
            </div>
          </section>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Одјави се
            </button>
            
            {userEmail && (
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Пријављени корисник:</p>
                <p className="text-white font-medium">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="animate-fadeIn">
          <ChangePassword />
        </div>
      )}
    </div>
  );
}

interface StepItemProps {
  children: React.ReactNode;
}

function StepItem({ children }: StepItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
      <p className="text-gray-300">{children}</p>
    </div>
  );
}