import { Link } from 'react-router-dom';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80';

export default function VehicleCard({ vehicle }) {
  const { _id, title, brand, model, year, mileage, fuel, type, price, negotiable, photos } = vehicle;
  const img = photos && photos.length > 0 ? photos[0] : PLACEHOLDER;

  return (
    <Link to={`/vehicule/${_id}`} className="card vehicle-card">
      <div className="vehicle-card-img">
        <img src={img} alt={title} loading="lazy" />
        <span className={`badge ${type === 'neuf' ? 'badge-green' : 'badge-orange'} vehicle-badge`}>
          {type === 'neuf' ? 'Neuf' : 'Occasion'}
        </span>
      </div>
      <div className="vehicle-card-body">
        <h3 className="vehicle-card-title">{brand} {model}</h3>
        <p className="vehicle-card-sub">{year}</p>
        <div className="vehicle-card-specs">
          <span>⛽ {fuel}</span>
          {mileage > 0 && <span>📍 {mileage.toLocaleString('fr-FR')} km</span>}
        </div>
        <div className="vehicle-card-footer">
          <div>
            <span className="vehicle-price">{price.toLocaleString('fr-FR')} FCFA</span>
            {negotiable && <span className="badge badge-dark" style={{ marginLeft: '0.5rem' }}>Négociable</span>}
          </div>
          <span className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Voir</span>
        </div>
      </div>
      <style>{`
        .vehicle-card { display: flex; flex-direction: column; }
        .vehicle-card-img { position: relative; aspect-ratio: 16/10; overflow: hidden; }
        .vehicle-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .vehicle-card:hover .vehicle-card-img img { transform: scale(1.05); }
        .vehicle-badge { position: absolute; top: 0.75rem; left: 0.75rem; }
        .vehicle-card-body { padding: 1rem 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
        .vehicle-card-title { font-size: 1rem; font-weight: 700; color: var(--white); }
        .vehicle-card-sub { color: var(--text-muted); font-size: 0.85rem; }
        .vehicle-card-specs { display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.82rem; }
        .vehicle-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--border); }
        .vehicle-price { font-size: 1rem; font-weight: 700; color: var(--primary); }
      `}</style>
    </Link>
  );
}
