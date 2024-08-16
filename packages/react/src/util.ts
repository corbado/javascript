export const getErrorCode = (message: string) => {
  const regex = /\(([^)]+)\)/;
  const matches = regex.exec(message);
  return matches ? matches[1] : undefined;
};
