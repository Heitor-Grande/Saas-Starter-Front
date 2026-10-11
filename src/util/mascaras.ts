/** Remove todos os caracteres que nao sejam numericos. */
export function somenteNumeros(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Aplica a mascara de CNPJ: 00.000.000/0000-00. */
export function mascararCnpj(valor: string): string {
  const digitos = somenteNumeros(valor).slice(0, 14);

  return digitos
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/** Aplica a mascara de CPF: 000.000.000-00. */
export function mascararCpf(valor: string): string {
  const digitos = somenteNumeros(valor).slice(0, 11);

  return digitos
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})(\d)/, "$1-$2");
}

/** Aplica a mascara de CEP: 00000-000. */
export function mascararCep(valor: string): string {
  return somenteNumeros(valor).slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
}

/** Aplica a mascara de telefone brasileiro com DDD. */
export function mascararTelefone(valor: string): string {
  const digitos = somenteNumeros(valor).slice(0, 11);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

/** Agrupa o numero do cartao em blocos de quatro digitos. */
export function mascararNumeroCartao(valor: string): string {
  const digitos = somenteNumeros(valor).slice(0, 16);
  return digitos.match(/.{1,4}/g)?.join(" ") ?? "";
}

/** Aplica a mascara de validade do cartao: MM/AA. */
export function mascararValidadeCartao(valor: string): string {
  const digitos = somenteNumeros(valor).slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

/** Limita o CVV aos quatro digitos aceitos pelo formulario. */
export function mascararCvv(valor: string): string {
  return somenteNumeros(valor).slice(0, 4);
}

/** Mantem o valor monetario no formato brasileiro: 0,00. */
export function mascararValorMonetario(valor: string): string {
  const digitos = somenteNumeros(valor);

  if (!digitos) return "";

  const centavos = Number(digitos);
  return (centavos / 100).toFixed(2).replace(".", ",");
}
