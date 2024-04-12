// Helper methods for arrays

/**
 * Get a random element from the provided array
 * @param array - the array
 * @returns a random element from `array`
 * @throws if `array` is empty
 */
export const getRandomElement = <T>(array: Array<T>): T => {
  if (array.length === 0) {
    throw new Error(
      'The array must contain at least one element to be randomly selected.'
    );
  }

  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Convert the input to an array
 * @param input a string, an array of strings, or undefined
 * @returns an empty array if undefined, a one-element array if a string, or the array itself
 */
export const toArray = (input?: string | string[]) =>
  input === undefined ? [] : Array.isArray(input) ? input : [input];
