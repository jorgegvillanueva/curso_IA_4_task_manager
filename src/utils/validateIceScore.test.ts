import { describe, expect, it } from 'vitest';

import {
  getValidIceScore,
  isValidIceValue,
  MAX_ICE_VALUE,
  MIN_ICE_VALUE,
  validateIceScore,
} from './validateIceScore';

import type { IceField, IceScore } from '../types/IceScore';

const VALID_SCORE: IceScore = { impact: 8, confidence: 7, effort: 4 };
const ICE_FIELDS: IceField[] = ['impact', 'confidence', 'effort'];

describe('isValidIceValue', () => {
  it.each([MIN_ICE_VALUE, 5, MAX_ICE_VALUE])('acepta el entero %s', (value) => {
    expect(isValidIceValue(value)).toBe(true);
  });

  it.each([0, 11, 5.5, Number.NaN, -1])('rechaza %s', (value) => {
    expect(isValidIceValue(value)).toBe(false);
  });
});

describe('validateIceScore', () => {
  it('acepta tres valores validos', () => {
    expect(validateIceScore(VALID_SCORE)).toBe(true);
  });

  it.each(ICE_FIELDS)('rechaza si %s se sale de rango', (field) => {
    expect(validateIceScore({ ...VALID_SCORE, [field]: 11 })).toBe(false);
  });
});

describe('getValidIceScore', () => {
  it.each(ICE_FIELDS)('devuelve null si falta %s', (field) => {
    expect(getValidIceScore({ ...VALID_SCORE, [field]: null })).toBeNull();
  });

  it.each([0, 11, 5.5])('devuelve null si un valor vale %s', (value) => {
    expect(getValidIceScore({ ...VALID_SCORE, effort: value })).toBeNull();
  });

  it('devuelve el objeto completo si los tres valores son validos', () => {
    expect(getValidIceScore(VALID_SCORE)).toEqual(VALID_SCORE);
  });
});
