// v5.7.1: Red Chrome Cargo solo para el GM. [Claude Code · 2026-10-30]
import { describe, expect, it } from 'vitest';
import { canSeeGmOnly } from '../gmAccess';

describe('canSeeGmOnly', () => {
  it('lo ve el GM de la mesa y, sin mesa, quien no tiene PIN o ya lo desbloqueó', () => {
    expect(canSeeGmOnly('table-gm')).toBe(true);
    expect(canSeeGmOnly('local-open')).toBe(true);
  });

  it('no lo ve el jugador de la mesa ni nadie con el PIN sin desbloquear', () => {
    expect(canSeeGmOnly('table-player')).toBe(false);
    expect(canSeeGmOnly('local-locked')).toBe(false);
  });
});
