import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getOrCreateWallet() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Try to get existing wallet address
        let { data: wallet, error: fetchError } = await supabase
          .from('wallet_addresses')
          .select('address')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (!wallet) {
          // Generate new wallet address using our database function
          const { data: newAddress, error: genError } = await supabase
            .rpc('generate_wallet_address');

          if (genError) throw genError;

          // Insert new wallet address
          const { data: newWallet, error: insertError } = await supabase
            .from('wallet_addresses')
            .insert([
              { user_id: user.id, address: newAddress }
            ])
            .select('address')
            .maybeSingle();

          if (insertError) throw insertError;
          
          if (!newWallet) {
            throw new Error('Failed to create wallet address');
          }
          
          wallet = newWallet;
        }

        setWalletAddress(wallet.address);
        setError(null);
      } catch (err) {
        console.error('Error getting/creating wallet:', err);
        setError(err instanceof Error ? err.message : 'Failed to get wallet address');
      } finally {
        setLoading(false);
      }
    }

    getOrCreateWallet();
  }, []);

  return { walletAddress, loading, error };
}