/**
 * Arte de cartas de ciberware.
 * Fuente: Cyberpunk Edgerunners Mission Kit (R. Talsorian Games), cartas de ciberware.
 * Los archivos viven en frontend/public/cemk/cyberware/ (ruta relativa por `base: './'`).
 */
const BERSERK = './cemk/cyberware/berserk.jpg';
const CYBERARM = './cemk/cyberware/cyberarm.jpg';
const GORILLA_ARM = './cemk/cyberware/gorilla-arm.jpg';
const MANTIS_BLADE = './cemk/cyberware/mantis-blade.jpg';
const MONOWIRE = './cemk/cyberware/monowire.jpg';
const SELF_ICE = './cemk/cyberware/self-ice.jpg';

export const CYBERWARE_CARD_ART: Record<string, string> = {
  'cw-cemk-berserk': BERSERK,
  cyberarm: CYBERARM,
  'cw-cemk-gorilla-arms': GORILLA_ARM,
  'cw-cemk-mantis-blades': MANTIS_BLADE,
  'cw-cemk-monowire': MONOWIRE,
  'cw-cemk-self-ice': SELF_ICE
};

export function getCyberwareArt(id: string): string | undefined {
  return CYBERWARE_CARD_ART[id];
}
