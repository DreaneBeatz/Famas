import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVehicle } from '../api';
import WhatsAppFloat from '../components/WhatsAppFloat';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80';

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    getVehicle(id)
      .then((r) => setVehicle(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader" style={{ paddingTop: '8rem' }}><div className="spinner" /></div>;
  if (!vehicle) return (
    <div style={{ textAlign: 'center', paddingTop: '8rem' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Véhicule introuvable.</p>
      <Link to="/catalogue" className="btn btn-primary">Retour au catalogue</Link>
    </div>
  );

  const photos = vehicle.photos?.length > 0 ? vehicle.photos : [PLACEHOLDER];
  const waMessage = `Bonjour Famas Auto, je suis intéressé(e) par : ${vehicle.brand} ${vehicle.model} ${vehicle.year} - Prix : ${vehicle.price.toLocaleString('fr-FR')} FCFA. Pouvez-vous me donner plus d'informations ?`;
  const waUrl = `https://wa.me/24104747098?text=${encodeURIComponent(waMessage)}`;

  const specs = [
    { label: 'Marque', value: vehicle.brand },
    { label: 'Modèle', value: vehicle.model },
    { label: 'Année', value: vehicle.year },
    { label: 'Kilométrage', value: vehicle.mileage > 0 ? `${vehicle.mileage.toLocaleString('fr-FR')} km` : '0 km (neuf)' },
    { label: 'Carburant', value: vehicle.fuel },
    { label: 'Boîte', value: vehicle.gearbox },
    { label: 'Type', value: vehicle.type === 'neuf' ? 'Neuf' : 'Occasion' },
  ];

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Accueil</Link>
          <span> / </span>
          <Link to="/catalogue" style={{ color: 'var(--text-muted)' }}>Catalogue</Link>
          <span> / </span>
          <span style={{ color: 'var(--text)' }}>{vehicle.brand} {vehicle.model}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
          {/* Photos */}
          <div>
            <div style={{
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              aspectRatio: '16/10',
              background: 'var(--dark-3)',
              marginBottom: '1rem',
            }}>
              <img src={photos[activePhoto]} alt={vehicle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {photos.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {photos.map((p, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)}
                    style={{
                      flexShrink: 0, width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden',
                      border: `2px solid ${i === activePhoto ? 'var(--primary)' : 'var(--border)'}`,
                      padding: 0, background: 'none', cursor: 'pointer',
                    }}>
                    <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Description</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{vehicle.description}</p>
              </div>
            )}

            {/* Options */}
            {vehicle.features?.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Équipements</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {vehicle.features.map((f) => (
                    <span key={f} className="badge badge-dark">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Infos + CTA */}
          <aside style={{ position: 'sticky', top: '90px' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className={`badge ${vehicle.type === 'neuf' ? 'badge-green' : 'badge-orange'}`}>
                  {vehicle.type === 'neuf' ? 'Neuf' : 'Occasion'}
                </span>
                {vehicle.negotiable && <span className="badge badge-dark">Prix négociable</span>}
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                {vehicle.brand} {vehicle.model}
              </h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{vehicle.year}</p>

              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                {vehicle.price.toLocaleString('fr-FR')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>FCFA</span>
              </div>

              {/* Specs rapides */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { icon: '⛽', label: vehicle.fuel },
                  { icon: '⚙️', label: vehicle.gearbox },
                  { icon: '📅', label: vehicle.year },
                  { icon: '📍', label: vehicle.mileage > 0 ? `${vehicle.mileage.toLocaleString('fr-FR')} km` : 'Neuf' },
                ].map(({ icon, label }) => (
                  <div key={label} style={{
                    background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)',
                    padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontSize: '0.85rem', color: 'var(--text-muted)',
                  }}>
                    <span>{icon}</span> {label}
                  </div>
                ))}
              </div>

              {/* Boutons */}
              <a href={waUrl} target="_blank" rel="noreferrer" className="btn"
                style={{ width: '100%', justifyContent: 'center', background: '#25D366', color: '#fff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contacter sur WhatsApp
              </a>
              <Link to={`/rendez-vous?vehicule=${vehicle._id}&titre=${encodeURIComponent(vehicle.brand + ' ' + vehicle.model)}`}
                className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                📅 Prendre un rendez-vous
              </Link>
            </div>

            {/* Fiche technique */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Fiche technique</h3>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {specs.map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <dt style={{ color: 'var(--text-muted)' }}>{label}</dt>
                    <dd style={{ fontWeight: 600 }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {/* WhatsApp flottant avec contexte véhicule */}
      <WhatsAppFloat vehicle={vehicle} />

      <style>{`
        @media (max-width: 900px) {
          main > .container > div[style] { grid-template-columns: 1fr !important; }
          aside { position: static !important; }
        }
      `}</style>
    </main>
  );
}
