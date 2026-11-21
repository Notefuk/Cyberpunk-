// Panel de la acción de la extensión: coberturas de la escena y tabla del Core p.182. [Claude Code · 2026-11-20]
import { createRoot } from 'react-dom/client';
import OBR from '@owlbear-rodeo/sdk';
import { COVER_MATERIALS, COVER_PAGE_REF } from '../data/coverTable';
import { getCover, labelText } from './coverItem';
import { useObrReady, useSceneItems } from './useObr';
import './owlbear.css';

function CoverPanel() {
  const ready = useObrReady();
  const items = useSceneItems(ready);
  const covers = items.flatMap((i) => {
    const c = getCover(i);
    return c ? [{ item: i, cover: c }] : [];
  });

  return (
    <>
      <h1>Coberturas de la escena</h1>
      {!ready ? (
        <p className="muted">Abrí una escena.</p>
      ) : covers.length === 0 ? (
        <p className="muted">Ninguna todavía. El GM marca un objeto: clic derecho → Cobertura.</p>
      ) : (
        <ul>
          {covers.map(({ item, cover }) => (
            <li key={item.id} className="row">
              <span className={cover.destroyed ? 'bad' : undefined}>{item.name ? `${item.name}: ` : ''}{labelText(cover)}</span>
              <button type="button" onClick={() => OBR.player.select([item.id], true)}>Seleccionar</button>
            </li>
          ))}
        </ul>
      )}

      <h1 style={{ marginTop: 12 }}>HP de cobertura ({COVER_PAGE_REF})</h1>
      <table>
        <thead><tr><th>Material</th><th className="n">Gruesa</th><th className="n">Fina</th></tr></thead>
        <tbody>
          {COVER_MATERIALS.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td className="n">{m.thickHp}</td>
              <td className="n">{m.thinHp || 'no cubre'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">Sin línea de visión no hay cobertura parcial. A 0 HP se destruye y el daño que sobra se pierde, salvo explosivos (Core p.174). El acero no lo dañan Martial Arts ni Brawling sin Cyberarm o BODY 10.</p>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<CoverPanel />);
