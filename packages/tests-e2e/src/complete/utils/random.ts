export const getRandomIntegerN = (digits: number): number => {
  const min = 10 ** (digits - 1);
  const add = 9 * 10 ** (digits - 1);

  return min + Math.floor(Math.random() * add);
};
