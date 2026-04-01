import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVehicles, getBrands } from '../api';
import VehicleCard from '../components/VehicleCard';

const FUELS = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
const GEARBOXES = ['Manuelle', 'Automatique'];

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const filters = {
    type: searchParams.get('type') || '',
    brand: searchParams.get('brand') || '',
    fuel: searchParams.get('fuel') || '',
    gearbox: searchParams.get('gearbox') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page') || 1),
  };

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  };

  const fetchVehicles = useCallback(() => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    getVehicles(params)
      .then((r) => { setVehicles(r.data.vehicles); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);
  useEffect(() => { getBrands().then((r) => setBrands(r.data)).catch(() => {}); }, []);

  const resetFilters = () => setSearchParams({});

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Header */}
      <div className="page-hero">
        <div className="container">
          <h1 className="section-title">Notre <span>Catalogue</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>{total} véhicule{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Filtres */}
          <aside style={{
            background: 'var(--dark-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            position: 'sticky',
            top: '90px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700 }}>Filtres</h3>
              <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.82rem', cursor: 'pointer' }}>
                Réinitialiser
              </button>
            </div>

            {/* Type */}
            <FilterSection label="Type">
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['', 'neuf', 'occasion'].map((v) => (
                  <button key={v} onClick={() => setFilter('type', v)}
                    className={`btn btn-sm ${filters.type === v ? 'btn-primary' : 'btn-dark'}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>
                    {v === '' ? 'Tous' : v === 'neuf' ? 'Neuf' : 'Occasion'}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Marque */}
            <FilterSection label="Marque">
              <select className="form-control" value={filters.brand} onChange={(e) => setFilter('brand', e.target.value)}>
                <option value="">Toutes les marques</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </FilterSection>

            {/* Carburant */}
            <FilterSection label="Carburant">
              <select className="form-control" value={filters.fuel} onChange={(e) => setFilter('fuel', e.target.value)}>
                <option value="">Tous</option>
                {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </FilterSection>

            {/* Boîte */}
            <FilterSection label="Boîte de vitesse">
              <select className="form-control" value={filters.gearbox} onChange={(e) => setFilter('gearbox', e.target.value)}>
                <option value="">Toutes</option>
                {GEARBOXES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </FilterSection>

            {/* Prix */}
            <FilterSection label="Prix (FCFA)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input className="form-control" type="number" placeholder="Min" value={filters.minPrice}
                  onChange={(e) => setFilter('minPrice', e.target.value)} />
                <input className="form-control" type="number" placeholder="Max" value={filters.maxPrice}
                  onChange={(e) => setFilter('maxPrice', e.target.value)} />
              </div>
            </FilterSection>
          </aside>

          {/* Grille */}
          <div>
            {loading ? (
              <div className="loader"><div className="spinner" /></div>
            ) : vehicles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p>Aucun véhicule ne correspond à vos critères.</p>
                <button onClick={resetFilters} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                  {vehicles.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
                </div>
                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`btn btn-sm ${filters.page === p ? 'btn-primary' : 'btn-dark'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .catalogue-layout { grid-template-columns: 1fr !important; }
          aside { position: static !important; }
        }
      `}</style>
    </main>
  );
}

function FilterSection({ label, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
