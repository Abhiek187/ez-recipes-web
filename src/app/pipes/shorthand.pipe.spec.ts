import { ShorthandPipe } from './shorthand.pipe';

describe('ShorthandPipe', () => {
  let pipe: ShorthandPipe;

  beforeEach(() => {
    pipe = new ShorthandPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  (
    [
      [0, '0'],
      [1, '1'],
      [999, '999'],
      [1000, '1K'],
      [1234, '1.2K'],
      [999999, '1M'],
      [1000000, '1M'],
      [1234567, '1.2M'],
      [999999999, '1B'],
      [1000000000, '1B'],
      [1234567890, '1.2B'],
    ] as [number, string][]
  ).forEach(([num, expectedValue]) => {
    it(`converts ${num} to shorthand ${expectedValue}`, () => {
      const actualValue = pipe.transform(num);
      expect(actualValue).toBe(expectedValue);
    });
  });
});
