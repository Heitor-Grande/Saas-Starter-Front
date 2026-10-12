/** Obtém o token JWT armazenado no cookie de autenticação do navegador. */
export function getTokenCookie(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="));

  if (!cookie) {
    return undefined;
  }

  try {
    return decodeURIComponent(cookie.slice("token=".length));
  } catch {
    return undefined;
  }
}
