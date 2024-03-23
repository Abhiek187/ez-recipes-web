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
