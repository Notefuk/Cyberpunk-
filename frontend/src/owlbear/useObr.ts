// Hooks comunes de la extensión de Owlbear. [Claude Code · 2026-11-20]
import { useEffect, useState } from 'react';
import OBR, { type Item } from '@owlbear-rodeo/sdk';

/** true cuando el SDK está listo y hay una escena abierta. */
export function useObrReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let off: (() => void) | undefined;
    OBR.onReady(async () => {
      const theme = await OBR.theme.getTheme();
      document.documentElement.dataset.theme = theme.mode;
      setReady(await OBR.scene.isReady());
      off = OBR.scene.onReadyChange(setReady);
    });
    return () => off?.();
  }, []);
  return ready;
}

export function useRole(ready: boolean): 'GM' | 'PLAYER' | null {
  const [role, setRole] = useState<'GM' | 'PLAYER' | null>(null);
  useEffect(() => {
    if (!ready) return;
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange((p) => setRole(p.role));
  }, [ready]);
  return role;
}

/** Ítems de la escena, actualizados en vivo. */
export function useSceneItems(ready: boolean): Item[] {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    if (!ready) return;
    OBR.scene.items.getItems().then(setItems);
    return OBR.scene.items.onChange(setItems);
  }, [ready]);
  return items;
}

export function useSelection(ready: boolean): string[] {
  const [sel, setSel] = useState<string[]>([]);
  useEffect(() => {
    if (!ready) return;
    OBR.player.getSelection().then((s) => setSel(s ?? []));
    return OBR.player.onChange((p) => setSel(p.selection ?? []));
  }, [ready]);
  return sel;
}
