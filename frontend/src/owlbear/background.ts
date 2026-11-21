// Página de fondo de la extensión: menú contextual y aplicación del daño (solo en el cliente del GM). [Claude Code · 2026-11-20]
import OBR from '@owlbear-rodeo/sdk';
import { applyDamageMessage, COVER_KEY, DAMAGE_CHANNEL, EXT_ID, type DamageMessage } from './coverItem';

const pageUrl = (path: string) => new URL(path, window.location.href).href;

OBR.onReady(() => {
  const icon = pageUrl('icon.svg');
  OBR.contextMenu.create({
    id: `${EXT_ID}/cover-menu`,
    icons: [
      // El GM ve la entrada en cualquier ítem (para marcarlo); el jugador, solo en coberturas.
      { icon, label: 'Cobertura', filter: { roles: ['GM'], max: 1 } },
      { icon, label: 'Cobertura', filter: { roles: ['PLAYER'], max: 1, every: [{ key: ['metadata', COVER_KEY], value: undefined, operator: '!=' }] } },
    ],
    embed: { url: pageUrl('cover.html'), height: 210 },
    onClick() {},
  });

  OBR.broadcast.onMessage(DAMAGE_CHANNEL, async (event) => {
    if ((await OBR.player.getRole()) !== 'GM') return;
    await applyDamageMessage(event.data as DamageMessage);
  });

  OBR.broadcast.onMessage(`${EXT_ID}/cover-log`, (event) => {
    OBR.notification.show(String(event.data), 'INFO');
  });
});
