import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createVehicle, updateVehicle, getVehicle } from '../../api';

const FUELS = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
const GEARBOXES = ['Manuelle', 'Automatique'];
const COMMON_FEATURES = ['Climatisation', 'GPS/Navigation', 'Toit ouvrant', 'Caméra de recul', 'Bluetooth', 'Cuir', 'Jantes alliage', 'Régulateur de vitesse', 'Aide au stationnement', 'Vitres électriques'];

const EMPTY = {
  title: '', brand: '', model: '', year: new Date().getFullYear(),
  mileage: 0, fuel: 'Essence', gearbox: 'Automatique', type: 'occasion',
  price: '', negotiable: false, description: '', features: [],
};

export default function VehicleForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getVehicle(id)
      .then((r) => {
        const v = r.data;
        setForm({
          title: v.title, brand: v.brand, model: v.model, year: v.year,
          mileage: v.mileage, fuel: v.fuel, gearbox: v.gearbox, type: v.type,
          price: v.price, negotiable: v.negotiable, description: v.description,
          features: v.features || [],
        });
        setExistingPhotos(v.photos || []);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const toggleFeature = (f) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }));
  };

  const removeExistingPhoto = (url) => {
    setExistingPhotos((p) => p.filter((x) => x !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'features') data.append(k, JSON.stringify(v));
        else data.append(k, v);
      });
      if (files.length > 0) files.forEach((f) => data.append('photos', f));
      if (isEdit) data.append('keepPhotos', JSON.stringify(existingPhotos));

      if (isEdit) await updateVehicle(id, data);
      else await createVehicle(data);

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-générer le titre
  useEffect(() => {
    if (form.brand && form.model && form.year) {
      setForm((f) => ({ ...f, title: `${f.brand} ${f.model} ${f.year}` }));
    }
  }, [form.brand, form.model, form.year]);

  if (fetching) return <div className="loader" style={{ paddingTop: '8rem' }}><div className="spinner" /></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', paddingBottom: '4rem' }}>
      {/* Header */}
      <header style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--border)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/admin" className="btn btn-dark" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>← Retour</Link>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {isEdit ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h1>
        </div>
      </header>

      <div className="container" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Identité */}
          <Section title="Identité du véhicule">
            <div className="grid-2">
              <div className="form-group">
                <label>Marque *</label>
                <input className="form-control" required value={form.brand} onChange={set('brand')} placeholder="Ex : Toyota" />
              </div>
              <div className="form-group">
                <label>Modèle *</label>
                <input className="form-control" required value={form.model} onChange={set('model')} placeholder="Ex : Corolla" />
              </div>
              <div className="form-group">
                <label>Année *</label>
                <input className="form-control" type="number" required value={form.year} onChange={set('year')} min={1990} max={2030} />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select className="form-control" value={form.type} onChange={set('type')}>
                  <option value="neuf">Neuf</option>
                  <option value="occasion">Occasion</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Caractéristiques */}
          <Section title="Caractéristiques techniques">
            <div className="grid-2">
              <div className="form-group">
                <label>Kilométrage</label>
                <input className="form-control" type="number" value={form.mileage} onChange={set('mileage')} min={0} />
              </div>
              <div className="form-group">
                <label>Carburant *</label>
                <select className="form-control" required value={form.fuel} onChange={set('fuel')}>
                  {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Boîte de vitesse *</label>
                <select className="form-control" required value={form.gearbox} onChange={set('gearbox')}>
                  {GEARBOXES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </Section>

          {/* Prix */}
          <Section title="Prix">
            <div className="grid-2">
              <div className="form-group">
                <label>Prix (FCFA) *</label>
                <input className="form-control" type="number" required value={form.price} onChange={set('price')} placeholder="Ex : 8500000" />
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.75rem' }}>
                  <input type="checkbox" checked={form.negotiable} onChange={set('negotiable')} style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                  Prix négociable
                </label>
              </div>
            </div>
          </Section>

          {/* Photos */}
          <Section title="Photos">
            {existingPhotos.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {existingPhotos.map((url) => (
                  <div key={url} style={{ position: 'relative' }}>
                    <img src={url} alt="" style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                    <button type="button" onClick={() => removeExistingPhoto(url)} style={{
                      position: 'absolute', top: '-6px', right: '-6px',
                      background: '#E30613', color: '#fff', border: 'none', borderRadius: '50%',
                      width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '2rem',
              cursor: 'pointer', transition: 'var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={(e) => setFiles(Array.from(e.target.files))} />
              <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {files.length > 0 ? `${files.length} photo(s) sélectionnée(s)` : 'Cliquer pour ajouter des photos'}
              </span>
            </label>
          </Section>

          {/* Description */}
          <Section title="Description">
            <textarea className="form-control" rows={4} value={form.description} onChange={set('description')}
              placeholder="Décrivez le véhicule : état général, historique, points forts..." style={{ resize: 'vertical' }} />
          </Section>

          {/* Équipements */}
          <Section title="Équipements & Options">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {COMMON_FEATURES.map((f) => (
                <button type="button" key={f} onClick={() => toggleFeature(f)}
                  className={`badge ${form.features.includes(f) ? 'badge-red' : 'badge-dark'}`}
                  style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                  {form.features.includes(f) ? '✓ ' : ''}{f}
                </button>
              ))}
            </div>
          </Section>

          {error && <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin" className="btn btn-dark" style={{ flex: 1, justifyContent: 'center' }}>Annuler</Link>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center', fontSize: '1rem' }}>
              {loading ? 'Enregistrement...' : isEdit ? '✓ Enregistrer les modifications' : '+ Publier le véhicule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--dark-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--dark-3)' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</h3>
      </div>
      <div style={{ padding: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
}
