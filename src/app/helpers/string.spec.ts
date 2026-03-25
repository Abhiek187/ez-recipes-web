import { mockChef } from '../models/profile.mock';
import { base64URLEncode, isNumeric } from './string';

describe('isNumeric', () => {
  it('passes all positive cases', () => {
    // Given a set of inputs that resemble numbers
    [
      0,
      1,
      1234567890,
      '1234567890',
      '0',
      '1',
      '1.1',
      '-1',
      '-1.2354',
      '-1234567890',
      -1,
      -32.1,
      '0x1',
    ].forEach((num) => {
      // When passed to isNumeric
      // Then they should all return true
      expect(isNumeric(num)).toBe(true);
    });
  });

  it('passes all negative cases', () => {
    // Given a set of inputs that don't resemble numbers
    [
      true,
      false,
      '1..1',
      '1,1',
      '-32.1.12',
      '',
      '   ',
      null,
      undefined,
      [],
      NaN,
    ].forEach((num) => {
      // When passed to isNumeric
      // Then they should all return false
      expect(isNumeric(num as string | number)).toBe(false);
    });
  });
});

describe('base64URLEncode', () => {
  it('URL encodes strings correctly', () => {
    // Given a set of strings
    ['', 'Hello, World!', mockChef.uid].forEach((str) => {
      // When base64 URL-encoded
      const base64UrlStr = base64URLEncode(str);
      // Then it should contain valid characters
      expect(base64UrlStr.includes('+')).toBeFalsy();
      expect(base64UrlStr.includes('/')).toBeFalsy();
      expect(base64UrlStr.includes('=')).toBeFalsy();
    });
  });
});
