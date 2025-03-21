import React, { useState } from 'react';
import { KeyRound, Loader2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Нове лозинке се не подударају');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Нова лозинка мора имати најмање 6 карактера');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      setStatus('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Грешка при промени лозинке');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <KeyRound className="h-6 w-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Промена Лозинке</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-2">
            Нова Лозинка
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Унесите нову лозинку"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
            Потврдите Нову Лозинку
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Поново унесите нову лозинку"
            required
            minLength={6}
          />
        </div>

        {errorMessage && (
          <div className="text-red-400 text-sm mt-2">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Промена у току...</span>
            </>
          ) : status === 'success' ? (
            <>
              <Check className="h-5 w-5" />
              <span>Лозинка успешно промењена!</span>
            </>
          ) : (
            <span>Промени Лозинку</span>
          )}
        </button>
      </form>
    </div>
  );
}