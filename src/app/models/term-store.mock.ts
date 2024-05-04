import TermStore from './term-store.model';
import { mockTerms } from './term.mock';

export const mockTime = 1e12; // a few days before 9/11
export const mockDate = new Date(mockTime);

export const mockTermStore = (
  expireAt = mockTime + 7 * 24 * 60 * 60 * 1000
): TermStore => ({
  terms: mockTerms,
  expireAt,
});

export const mockTermStoreStr = (
  expireAt = mockTime + 7 * 24 * 60 * 60 * 1000
): string => JSON.stringify(mockTermStore(expireAt));
