/**
 * Checks if a string value represents a truthy value.
 * Recognizes 'TRUE', 'true', 'on', 'yes', and '1' as truthy.
 *
 * @param value - The string value to check
 * @returns `true` if the value is considered truthy, `false` otherwise
 */
export const isTruthy = (value: string): boolean => {
  return (
    value === 'TRUE' ||
    value === 'true' ||
    value === 'on' ||
    value === 'yes' ||
    value === '1'
  );
};

/**
 * Checks if a string value represents a falsy value.
 * Recognizes 'FALSE', 'false', 'off', 'no', and '0' as falsy.
 *
 * @param value - The string value to check
 * @returns `true` if the value is considered falsy, `false` otherwise
 */
export const isFalsy = (value: string): boolean => {
  return (
    value === 'FALSE' ||
    value === 'false' ||
    value === 'off' ||
    value === 'no' ||
    value === '0'
  );
};

/**
 * Converts a value to a boolean.
 * Handles boolean, string, and number types.
 * For strings, uses isTruthy() to determine the boolean value.
 * For numbers, 0 is falsy, all other numbers are truthy.
 *
 * @param value - The value to convert (string, boolean, or number)
 * @returns The boolean representation of the value
 */
export const convertToBoolean = (value: string | boolean | number): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (!value) {
    return false;
  }
  return isTruthy(value.toString());
};
