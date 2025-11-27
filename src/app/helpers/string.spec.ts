import { isNumeric } from './string';

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
