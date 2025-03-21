import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useStats() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getStats() {
      try {
        const { data, error: fetchError } = await supabase
          .from('statistics')
          .select('total_users')
          .single();

        if (fetchError) throw fetchError;
        
        setTotalUsers(data.total_users);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    }

    getStats();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('statistics_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'statistics'
      }, (payload) => {
        if (payload.new) {
          setTotalUsers(payload.new.total_users);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { totalUsers, loading, error };
}