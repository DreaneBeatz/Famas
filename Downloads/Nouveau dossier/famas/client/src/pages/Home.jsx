import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentVehicles } from '../api';
import VehicleCard from '../components/VehicleCard';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentVehicles()
      .then((r) => setVehicles(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Décoration rouge Famas */}
        <div style={{
          position: 'absolute', top: '20%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(227,6,19,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(227,6,19,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '650px' }}>
            <span className="badge badge-red" style={{ marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
              VENTE DE VÉHICULES · GABON
            </span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Trouvez le<br />
              <span style={{ color: 'var(--primary)' }}>véhicule parfait</span><br />
              avec Famas
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '500px' }}>
              Véhicules neufs et d'occasion soigneusement sélectionnés. Qualité garantie, prix transparents, service premium.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/catalogue" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                Voir le catalogue →
              </Link>
              <Link to="/rendez-vous" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                Prendre RDV
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap',
          }}>
            {[['100+', 'Véhicules vendus'], ['98%', 'Clients satisfaits'], ['5★', 'Note moyenne']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{num}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNONCES RÉCENTES */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <h2 className="section-title">Dernières <span>annonces</span></h2>
          <p className="section-subtitle">Découvrez nos véhicules disponibles dès maintenant</p>
          {loading ? (
            <div className="loader"><div className="spinner" /></div>
          ) : vehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Aucun véhicule disponible pour le moment. Revenez bientôt !
            </div>
          ) : (
            <div className="grid-3">
              {vehicles.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/catalogue" className="btn btn-outline">Voir tout le catalogue →</Link>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="section" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <h2 className="section-title">Pourquoi choisir <span>Famas</span> ?</h2>
          <p className="section-subtitle">Des avantages concrets pour chaque acheteur</p>
          <div className="grid-3">
            {[
              { icon: '🛡️', title: 'Véhicules vérifiés', desc: 'Chaque véhicule est inspecté et certifié avant la mise en vente.' },
              { icon: '💎', title: 'Prix transparents', desc: 'Pas de frais cachés. Le prix affiché est le prix final.' },
              { icon: '🤝', title: 'Accompagnement', desc: 'Notre équipe vous guide de la recherche jusqu\'à la remise des clés.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--white)' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Vous avez une <span>question</span> ?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Contactez-nous directement sur WhatsApp, on vous répond rapidement.
          </p>
          <a
            href="https://wa.me/24104747098?text=Bonjour%20Famas%20Auto%2C%20je%20souhaite%20avoir%20des%20informations."
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ fontSize: '1rem', padding: '0.9rem 2.5rem', background: '#25D366', display: 'inline-flex', gap: '0.75rem' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Nous contacter sur WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
