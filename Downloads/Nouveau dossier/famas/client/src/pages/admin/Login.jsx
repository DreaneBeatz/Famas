import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      loginUser(res.data.token);
      navigate('/admin');
    } catch {
      setError('Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--dark)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.svg" alt="Famas" style={{ height: '50px', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Espace Administrateur</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connectez-vous pour gérer le site</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'var(--dark-2)', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', padding: '2rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          <div className="form-group">
            <label>Identifiant</label>
            <input className="form-control" required value={form.username} onChange={set('username')} placeholder="admin" autoComplete="username" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input className="form-control" type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <p style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ justifyContent: 'center', padding: '0.85rem' }}>
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>
      </div>
    </div>
  );
}
