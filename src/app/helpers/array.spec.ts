import { getRandomElement } from './array';

describe('getRandomElement', () => {
  it('returns an element in the array', () => {
    // Given an array with N elements
    const array = [1, 2, 3];
    // When getRandomElement() is called
    const randomNum = getRandomElement(array);
    // Then the element returned must be in the array
    // Note: Math.random() doesn't provide a way to initalize a seed,
    // so we can't guarantee the function returns a certain element
    expect(array).toContain(randomNum);
  });

  it("returns the same element if the array's length is 1", () => {
    // Given an array with one element
    const array = ['chrysno'];
    // When getRandomElement() is called
    const randomString = getRandomElement(array);
    // Then the function should return that one element
    expect(randomString).toBe(array[0]);
  });

  it('throws an error if the array is empty', () => {
    // Given an empty array
    const emptyArray: object[] = [];
    // When getRandomElement() is called
    // Then the function should throw an error stating that the array
    // must contain at least one element
    expect(() => getRandomElement(emptyArray)).toThrowError(
      'The array must contain at least one element to be randomly selected.'
    );
  });
});
