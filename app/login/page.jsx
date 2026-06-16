'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Error de autenticación');
      router.replace('/');
      router.refresh();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="login-title">🎯 Job Tracker</span>
        <span className="login-sub">Ingresa la contraseña para continuar</span>
        <input
          type="password"
          className="form-input"
          placeholder="Contraseña"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <span className="login-error">{error}</span>}
        <button type="submit" className="btn btn-primary" disabled={loading || !password}>
          {loading ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
