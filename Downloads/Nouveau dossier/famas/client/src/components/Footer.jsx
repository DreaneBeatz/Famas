import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark-2)',
      borderTop: '1px solid var(--border)',
      padding: '3rem 0 1.5rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--primary)' }}>FAMAS</span>{' '}
              <span style={{ fontWeight: 400, fontSize: '1rem' }}>AUTO</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Votre partenaire de confiance pour l'achat de véhicules neufs et d'occasion.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['/', 'Accueil'], ['/catalogue', 'Catalogue'], ['/rendez-vous', 'Rendez-vous']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <a href="https://wa.me/24104747098" target="_blank" rel="noreferrer"
                style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📱 WhatsApp Famas
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Famas Auto. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
