import React, { useCallback, useEffect, useState } from 'react';
import DataTable from './DataTable';
import { API_BASE } from '../api';

export default function Leaderboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const endpoint = `${API_BASE}/api/leaderboard/`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[Leaderboard] endpoint:', endpoint);
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const payload = await res.json();
      console.log('[Leaderboard] payload:', payload);
      const data = Array.isArray(payload) ? payload : payload.results ?? [];
      setItems(data);
    } catch (err) {
      console.error('[Leaderboard] fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <DataTable
      title="Leaderboard"
      items={items}
      endpoint={endpoint}
      loading={loading}
      error={error}
      onRefresh={fetchData}
    />
  );
}
