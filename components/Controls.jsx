'use client';
import { STATUSES, PLATFORMS } from '@/lib/constants';

export default function Controls({ search, setSearch, filterPlat, setFilterPlat, filterStatus, setFilterStatus, sortFit, setSortFit, onAdd, onExport }) {
  return (
    <div className="controls">
      <input
        className="search-input"
        placeholder="🔍 Cargo o empresa..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <select
        className="filter-select"
        value={filterPlat}
        onChange={e => setFilterPlat(e.target.value)}
      >
        <option value="">Todas las plataformas</option>
        {PLATFORMS.map(p => <option key={p}>{p}</option>)}
      </select>

      <select
        className="filter-select"
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
      >
        <option value="">Todos los estados</option>
        {STATUSES.map(s => (
          <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={sortFit}
        onChange={e => setSortFit(e.target.value)}
      >
        <option value="">Sin ordenar</option>
        <option value="desc">Fit: mayor a menor</option>
        <option value="asc">Fit: menor a mayor</option>
      </select>

      <div className="spacer" />

      <button className="btn btn-ghost" onClick={onExport}>↓ CSV</button>
      <button className="btn btn-primary" onClick={onAdd}>+ Agregar</button>
    </div>
  );
}
