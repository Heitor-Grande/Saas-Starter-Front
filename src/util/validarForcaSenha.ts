export interface ResultadoValidacaoForcaSenha {
  valida: boolean;
  erros: string[];
}

/** Verifica os requisitos mínimos de segurança definidos para senhas de usuários. */
export function validarForcaSenha(senha: string): ResultadoValidacaoForcaSenha {
  const erros: string[] = [];

  if (senha.length < 5) {
    erros.push("A senha deve ter no mínimo 5 caracteres.");
  }

  if (!/\d/.test(senha)) {
    erros.push("A senha deve ter pelo menos 1 número.");
  }

  if (!/[A-Z]/.test(senha)) {
    erros.push("A senha deve ter pelo menos 1 letra maiúscula.");
  }

  if (!/[^A-Za-z0-9]/.test(senha)) {
    erros.push("A senha deve ter pelo menos 1 caractere especial.");
  }

  return { valida: erros.length === 0, erros };
}
