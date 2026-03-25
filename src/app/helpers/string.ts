// Helper methods for strings

/**
 * Check if the input is a number or a string that can be parsed as a number
 *
 * Source: https://stackoverflow.com/a/58550111
 * @param num the number or string to check
 * @returns true if `num` can be parsed as a number, false otherwise
 */
export const isNumeric = (num: number | string): boolean =>
  (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
  !isNaN(num as number);

/**
 * Convert a string to a base64 URL-encoded string
 * @param str the input string
 * @returns a base64 URL-encoded string
 */
export const base64URLEncode = (str: string): string =>
  window
    // Convert the binary string to a base64 string ([a-zA-Z0-9+/])
    .btoa(String.fromCharCode(...new TextEncoder().encode(str)))
    // Replace + and / with - and _ for easier URL encoding
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    // Remove padding characters (=)
    .replace(/=+$/, '');
