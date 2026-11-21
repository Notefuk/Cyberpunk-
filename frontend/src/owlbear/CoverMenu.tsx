// Formulario embebido en el menú contextual "Cobertura": marcar (GM), dañar (todos), restaurar y quitar (GM). [Claude Code · 2026-11-20]
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { COVER_MATERIALS, COVER_PAGE_REF, type CoverMaterialId, type CoverThickness } from '../data/coverTable';
import { applyCoverDamage, coverMaxHp } from '../engine/cover';
import { coverTitle, getCover, markCover, removeCover, requestDamage, restoreItemCover } from './coverItem';
import { useObrReady, useRole, useSceneItems, useSelection } from './useObr';
import './owlbear.css';

function MarkForm({ onMark }: { onMark: (m: CoverMaterialId, t: CoverThickness) => void }) {
  const [material, setMaterial] = useState<CoverMaterialId>('concrete');
  return (
    <>
      <h1>Marcar como cobertura</h1>
      <div className="row">
        <select value={material} onChange={(e) => setMaterial(e.target.value as CoverMaterialId)} aria-label="Material">
          {COVER_MATERIALS.map((m) => (
            <option key={m.id} value={m.id}>{m.name} ({m.label})</option>
          ))}
        </select>
      </div>
      <div className="row">
        {(['thin', 'thick'] as const).map((t) => {
          const hp = coverMaxHp(material, t);
          return (
            <button key={t} type="button" className="primary" disabled={hp === null} onClick={() => onMark(material, t)}>
              {t === 'thick' ? 'Gruesa' : 'Fina'} ({hp === null ? 'no cubre' : `${hp} HP`})
            </button>
          );
        })}
      </div>
      <p className="muted">Una casilla de 2 m x 2 m. HP según {COVER_PAGE_REF}.</p>
    </>
  );
}

function CoverMenu() {
  const ready = useObrReady();
  const role = useRole(ready);
  const items = useSceneItems(ready);
  const selection = useSelection(ready);
  const [damage, setDamage] = useState(0);
  const [busy, setBusy] = useState(false);

  if (!ready || !role) return <p className="muted">Cargando…</p>;
  const item = items.find((i) => i.id === selection[0]);
  if (!item) return <p className="muted">Seleccioná un objeto del mapa.</p>;
  const cover = getCover(item);
  const gm = role === 'GM';

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try { await fn(); } finally { setBusy(false); }
  };

  if (!cover) {
    return gm ? <MarkForm onMark={(m, t) => run(() => markCover(item, m, t))} /> : <p className="muted">Este objeto no es cobertura.</p>;
  }

  const preview = damage > 0 ? applyCoverDamage(cover, damage) : null;
  return (
    <>
      <h1>{coverTitle(cover)}</h1>
      {cover.destroyed ? (
        <p className="bad">DESTRUIDA: ya no cubre.</p>
      ) : (
        <>
          <p>{cover.hp} / {cover.maxHp} HP</p>
          <div className="bar"><div style={{ width: `${(cover.hp / cover.maxHp) * 100}%` }} /></div>
          <div className="row">
            <input type="number" min={0} value={damage || ''} placeholder="Daño" aria-label="Daño"
              onChange={(e) => setDamage(Math.max(0, Number(e.target.value) || 0))} />
            <button type="button" className="primary" disabled={busy || damage <= 0}
              onClick={() => run(async () => { await requestDamage(item.id, damage); setDamage(0); })}>
              Aplicar daño
            </button>
          </div>
          {preview && preview.lost > 0 && (
            <p className="warn">Se destruye y sobran {preview.lost}: se pierden, no pasan a quien está detrás (salvo explosivos).</p>
          )}
          {cover.material === 'steel' && <p className="muted">Martial Arts y Brawling no la dañan sin Cyberarm o BODY 10.</p>}
          {!gm && <p className="muted">El daño lo aplica el GM: tiene que estar en la sala.</p>}
        </>
      )}
      {gm && (
        <div className="row">
          <button type="button" disabled={busy} onClick={() => run(() => restoreItemCover(item))}>Restaurar</button>
          <button type="button" disabled={busy} onClick={() => run(() => removeCover(item))}>Quitar cobertura</button>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById('root')!).render(<CoverMenu />);
