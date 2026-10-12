/** Remove todos os cookies acessíveis pelo navegador no caminho raiz. */
export function clearCookies(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie.split(";").forEach((cookie) => {
    const separatorIndex = cookie.indexOf("=");
    const name = (separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie).trim();

    if (name) {
      document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  });
}
