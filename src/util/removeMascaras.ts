import { somenteNumeros } from "@/util/mascaras";

/** Remove a formatacao de CNPJ. */
export function removerMascaraCnpj(valor: string): string {
  return somenteNumeros(valor);
}

/** Remove a formatacao de CPF. */
export function removerMascaraCpf(valor: string): string {
  return somenteNumeros(valor);
}

/** Remove a formatacao de CEP. */
export function removerMascaraCep(valor: string): string {
  return somenteNumeros(valor);
}

/** Remove a formatacao de telefone. */
export function removerMascaraTelefone(valor: string): string {
  return somenteNumeros(valor);
}

/** Remove os espacos do numero de cartao. */
export function removerMascaraNumeroCartao(valor: string): string {
  return somenteNumeros(valor);
}

/** Remove a barra da validade do cartao. */
export function removerMascaraValidadeCartao(valor: string): string {
  return somenteNumeros(valor);
}

/** Remove caracteres nao numericos do CVV. */
export function removerMascaraCvv(valor: string): string {
  return somenteNumeros(valor);
}

/** Converte o valor monetario brasileiro formatado para o valor decimal. */
export function removerMascaraValorMonetario(valor: string): string {
  const centavos = somenteNumeros(valor);

  if (!centavos) return "";

  return (Number(centavos) / 100).toFixed(2);
}
