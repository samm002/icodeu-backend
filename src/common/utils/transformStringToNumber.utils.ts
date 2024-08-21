export function transformToNumber(
  ...args: (string | number | undefined)[]
): number[] {
  return args
    .map((arg) => (arg !== '' ? Number(arg) : null))
    .filter((num) => !isNaN(num));
}
