import { useEffect, useState } from 'react';

interface ParameterReading {
  vessel_mmsi: string;
  parameter_group: string;
  parameter_name: string;
  value: number;
  unit: string;
  watch: string;
  entered_by?: string;
  logged_at?: string;
}

export default function Dashboard() {
  const [readings, setReadings] = useState<ParameterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('https://botanical-durably-coyness.ngrok-free.dev/webhook/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ get_dashboard: 'true' }).toString(),
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setReadings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Could not load parameter data.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const grouped = readings.reduce((acc, r) => {
    if (!acc[r.parameter_group]) acc[r.parameter_group] = [];
    acc[r.parameter_group].push(r);
    return acc;
  }, {} as Record<string, ParameterReading[]>);

  return (
    <div style={{ padding: '28px 28px 48px', maxWidth: '1440px', margin: '0 auto' }}>
      <h1 style={{ color: '#0d9488', fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
        Vessel Parameter Dashboard
      </h1>

      {loading && <p style={{ color: '#94a3b8' }}>Loading readings...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {!loading && !error && readings.length === 0 && (
        <p style={{ color: '#94a3b8' }}>No readings logged yet.</p>
      )}

      {Object.entries(grouped).map(([group, items]) => (
        <div
          key={group}
          style={{
            background: '#0f172a',
            border: '1px solid rgba(13,148,136,0.3)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          }}
        >
          <h2 style={{ color: '#0d9488', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            {group}
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(13,148,136,0.2)', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Parameter</th>
                <th style={{ padding: '8px' }}>Value</th>
                <th style={{ padding: '8px' }}>Unit</th>
                <th style={{ padding: '8px' }}>Watch</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={{ padding: '8px' }}>{r.parameter_name}</td>
                  <td style={{ padding: '8px', color: '#5eead4', fontWeight: 600 }}>{r.value}</td>
                  <td style={{ padding: '8px' }}>{r.unit}</td>
                  <td style={{ padding: '8px', color:
