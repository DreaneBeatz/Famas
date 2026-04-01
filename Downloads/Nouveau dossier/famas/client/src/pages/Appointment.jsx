import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createAppointment, getVehicles } from '../api';

export default function Appointment() {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleId: searchParams.get('vehicule') || '',
    date: '',
    message: '',
  });

  useEffect(() => {
    getVehicles({ limit: 100 })
      .then((r) => setVehicles(r.data.vehicles))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createAppointment(form);
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="page-hero">
        <div className="container">
          <h1 className="section-title">Prendre <span>rendez-vous</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Remplissez le formulaire, nous vous confirmons sous 24h</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '3rem', maxWidth: '600px' }}>
        {success ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            background: 'var(--dark-2)', borderRadius: 'var(--radius)',
            border: '1px solid rgba(76,175,80,0.3)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Rendez-vous enregistré !</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Nous avons bien reçu votre demande. Un conseiller Famas vous contactera très prochainement.
            </p>
            <a
              href={`https://wa.me/24104747098?text=${encodeURIComponent('Bonjour Famas Auto, je viens de soumettre une demande de rendez-vous. Mon nom : ' + form.name)}`}
              target="_blank" rel="noreferrer" className="btn"
              style={{ background: '#25D366', color: '#fff' }}>
              Confirmer via WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            background: 'var(--dark-2)', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', padding: '2rem',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div className="form-group">
              <label>Nom complet *</label>
              <input className="form-control" required value={form.name} onChange={set('name')} placeholder="Ex : Jean Moussavou" />
            </div>
            <div className="form-group">
              <label>Téléphone *</label>
              <input className="form-control" required value={form.phone} onChange={set('phone')} placeholder="Ex : +241 07 XX XX XX" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" value={form.email} onChange={set('email')} placeholder="Ex : jean@email.com" />
            </div>
            <div className="form-group">
              <label>Véhicule concerné</label>
              <select className="form-control" value={form.vehicleId} onChange={set('vehicleId')}>
                <option value="">— Sélectionner un véhicule (optionnel)</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.brand} {v.model} {v.year}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date souhaitée *</label>
              <input className="form-control" type="date" required value={form.date} onChange={set('date')}
                min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-control" rows={4} value={form.message} onChange={set('message')}
                placeholder="Précisez votre demande..." style={{ resize: 'vertical' }} />
            </div>
            {error && <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}>
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande →'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
