// Helper methods for strings

/**
 * Check if the input is a number or a string that can be parsed as a number
 *
 * Source: https://stackoverflow.com/a/58550111
 * @param num the number or string to check
 * @returns true if `num` can be parsed as a number, false otherwise
 */
export const isNumeric = (num: number | string): boolean =>
  (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
  !isNaN(num as number);
