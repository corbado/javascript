export const getErrorCode = (message: string) => {
  const regex = /\(([^)]+)\)/;
  const matches = regex.exec(message);
  return matches ? matches[1] : undefined;
};

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
