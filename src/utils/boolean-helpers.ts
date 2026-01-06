export function isTruthy(value: string): boolean {
  return (
    value === 'TRUE' ||
    value === 'true' ||
    value === 'on' ||
    value === 'yes' ||
    value === '1'
  );
}
export function isFalsy(value: string): boolean {
  return (
    value === 'FALSE' ||
    value === 'false' ||
    value === 'off' ||
    value === 'no' ||
    value === '0'
  );
}

export function convertToBoolean(value: string | boolean | number): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (!value) {
    return false;
  }
  return isTruthy(value.toString());
}
