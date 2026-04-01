import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVehicles, deleteVehicle, getAppointments, updateAppointmentStatus, deleteAppointment } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const [tab, setTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const loadVehicles = () => {
    getVehicles({ limit: 100 })
      .then((r) => setVehicles(r.data.vehicles))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const loadAppointments = () => {
    getAppointments().then((r) => setAppointments(r.data)).catch(() => {});
  };

  useEffect(() => { loadVehicles(); loadAppointments(); }, []);

  const handleDeleteVehicle = async (id, title) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    await deleteVehicle(id);
    setVehicles((v) => v.filter((x) => x._id !== id));
  };

  const handleDeleteAppt = async (id) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    await deleteAppointment(id);
    setAppointments((a) => a.filter((x) => x._id !== id));
  };

  const handleStatusChange = async (id, status) => {
    await updateAppointmentStatus(id, status);
    setAppointments((a) => a.map((x) => x._id === id ? { ...x, status } : x));
  };

  const logout = () => { logoutUser(); navigate('/admin/login'); };

  const statusColor = { 'en attente': '#ff9800', 'confirmé': '#4caf50', 'annulé': '#f44336' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>
      {/* Header admin */}
      <header style={{
        background: 'var(--dark-2)', borderBottom: '1px solid var(--border)',
        padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/logo.png" alt="Famas" style={{ height: '32px' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Administration</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/" className="btn btn-dark" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              ← Site
            </Link>
            <button onClick={logout} className="btn btn-dark" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', flex: 1 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Véhicules', value: vehicles.length, icon: '🚗' },
            { label: 'RDV en attente', value: appointments.filter((a) => a.status === 'en attente').length, icon: '📅' },
            { label: 'RDV total', value: appointments.length, icon: '📋' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.8rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['vehicles', 'appointments'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-dark'}`}>
              {t === 'vehicles' ? '🚗 Véhicules' : '📅 Rendez-vous'}
            </button>
          ))}
        </div>

        {/* Véhicules */}
        {tab === 'vehicles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700 }}>Véhicules</h2>
              <Link to="/admin/vehicule/nouveau" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                + Ajouter un véhicule
              </Link>
            </div>
            {loading ? <div className="loader"><div className="spinner" /></div> : (
              <div style={{ background: 'var(--dark-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      {['Véhicule', 'Type', 'Prix', 'Actions'].map((h) => (
                        <th key={h} style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Aucun véhicule</td></tr>
                    ) : vehicles.map((v) => (
                      <tr key={v._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={v.photos?.[0] || 'https://via.placeholder.com/48x36'} alt=""
                              style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{v.brand} {v.model}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{v.year}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span className={`badge ${v.type === 'neuf' ? 'badge-green' : 'badge-orange'}`}>
                            {v.type}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {v.price.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to={`/admin/vehicule/${v._id}`} className="btn btn-dark" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                              Modifier
                            </Link>
                            <button onClick={() => handleDeleteVehicle(v._id, `${v.brand} ${v.model}`)}
                              className="btn" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#3a1010', color: '#f44336', border: '1px solid #f44336' }}>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rendez-vous */}
        {tab === 'appointments' && (
          <div>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Rendez-vous</h2>
            <div style={{ background: 'var(--dark-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    {['Client', 'Véhicule', 'Date', 'Statut', 'Actions'].map((h) => (
                      <th key={h} style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Aucun rendez-vous</td></tr>
                  ) : appointments.map((a) => (
                    <tr key={a._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>{a.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{a.phone}</div>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {a.vehicleTitle || '—'}
                      </td>
                      <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem' }}>
                        {new Date(a.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                          background: `${statusColor[a.status]}22`, color: statusColor[a.status],
                          border: `1px solid ${statusColor[a.status]}44`,
                        }}>{a.status}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {a.status !== 'confirmé' && (
                            <button onClick={() => handleStatusChange(a._id, 'confirmé')}
                              className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', background: '#1a3a1a', color: '#4caf50', border: '1px solid #4caf50' }}>
                              ✓ Confirmer
                            </button>
                          )}
                          <button onClick={() => handleDeleteAppt(a._id)}
                            className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', background: '#3a1010', color: '#f44336', border: '1px solid #f44336' }}>
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
