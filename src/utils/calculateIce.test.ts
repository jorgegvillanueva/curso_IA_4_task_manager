import { describe, expect, it } from 'vitest';

import { calculateIce } from './calculateIce';

describe('calculateIce', () => {
  it('multiplica impacto por confianza y divide entre esfuerzo', () => {
    expect(calculateIce({ impact: 8, confidence: 7, effort: 4 })).toBe(14);
  });

  it('devuelve decimales cuando el esfuerzo no divide al producto', () => {
    expect(calculateIce({ impact: 1, confidence: 1, effort: 10 })).toBe(0.1);
  });

  it('alcanza el maximo con impacto y confianza 10 y esfuerzo 1', () => {
    expect(calculateIce({ impact: 10, confidence: 10, effort: 1 })).toBe(100);
  });
});
