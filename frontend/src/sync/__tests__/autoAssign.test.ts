// [Claude Code · 2026-11-05] v5.11.0 (plan 25): a qué campaña entra sola una ficha de jugador.
import { describe, expect, it } from 'vitest';
import { pickAutoCampaign, shouldAutoAssign } from '../autoAssign';

const c = (id: string, gmUid: string, memberUids: string[]) => ({ id, gmUid, memberUids });

describe('campaña automática', () => {
  it('jugador en una sola campaña: va a esa', () => {
    expect(pickAutoCampaign([c('a', 'gm', ['gm', 'me'])], 'me', null)).toBe('a');
  });

  it('nunca a una campaña donde soy el GM', () => {
    expect(pickAutoCampaign([c('a', 'me', ['me', 'p1'])], 'me', 'a')).toBeNull();
    expect(pickAutoCampaign([c('a', 'me', ['me']), c('b', 'gm', ['gm', 'me'])], 'me', null)).toBe('b');
  });

  it('jugador en varias: la mesa activa si es una de ellas; si no, ninguna', () => {
    const list = [c('a', 'gm', ['gm', 'me']), c('b', 'gm2', ['gm2', 'me'])];
    expect(pickAutoCampaign(list, 'me', 'b')).toBe('b');
    expect(pickAutoCampaign(list, 'me', null)).toBeNull();
    expect(pickAutoCampaign(list, 'me', 'otra')).toBeNull();
  });

  it('sin campañas: ninguna', () => {
    expect(pickAutoCampaign([], 'me', null)).toBeNull();
  });

  it('entra una ficha de jugador libre; no una de NPC, una ya asignada ni una que estoy pasando', () => {
    expect(shouldAutoAssign({}, null, false)).toBe(true);
    expect(shouldAutoAssign({ sheetKind: 'player' }, null, false)).toBe(true);
    expect(shouldAutoAssign({ sheetKind: 'npc' }, null, false)).toBe(false);
    expect(shouldAutoAssign({}, 'a', false)).toBe(false);
    expect(shouldAutoAssign({}, null, true)).toBe(false);
    expect(shouldAutoAssign(undefined, null, false)).toBe(false);
  });
});
