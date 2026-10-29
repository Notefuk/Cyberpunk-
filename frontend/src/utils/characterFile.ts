// v5.3.1 [Claude Code · 2026-10-29]: descarga de fichas en archivos .json (MESA // CAMPAÑA).
// Nombre: "<personaje> - <rol> (<jugador>).json". El contenido es el mismo que "Descargar" en STREET LAB,
// así que se vuelve a cargar con "IMPORTAR FICHA (archivo)".
import type { CharacterSheet } from '../types/cyberpunk';

/** Saca los caracteres que Windows no acepta en un nombre de archivo y los espacios de más. */
function cleanPart(s: string): string {
  return s.replace(/[\\/:*?"<>|]/g, '').replace(/[\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim();
}

export function characterFileName(handle: string, role: string, player: string): string {
  const name = cleanPart(handle) || 'Ficha';
  const r = cleanPart(role);
  const p = cleanPart(player);
  return `${name}${r ? ` - ${r}` : ''}${p ? ` (${p})` : ''}.json`;
}

export function downloadTextFile(fileName: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Baja una ficha por archivo. Espaciadas para que el navegador no descarte ninguna. */
export function downloadCharacters(items: { sheet: CharacterSheet; player: string }[]): void {
  items.forEach(({ sheet, player }, i) => {
    setTimeout(() => downloadTextFile(characterFileName(sheet.handle, sheet.role, player), JSON.stringify(sheet, null, 2)), i * 400);
  });
}
