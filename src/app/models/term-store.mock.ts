import TermStore from './term-store.model';
import { mockTerms } from './term.mock';

export const mockTermStore = (
  expireAt = Date.now() + 7 * 24 * 60 * 60 * 1000
): TermStore => ({
  terms: mockTerms,
  expireAt,
});

export const mockTermStoreStr = (
  expireAt = Date.now() + 7 * 24 * 60 * 60 * 1000
): string => JSON.stringify(mockTermStore(expireAt));
