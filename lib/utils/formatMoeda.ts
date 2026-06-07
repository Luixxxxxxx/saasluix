/** Formata um número como "R$ 18.430" (sem centavos — usado nos resumos). */
export function formatMoeda(valor: number): string {
  return "R$ " + Math.round(valor).toLocaleString("pt-BR");
}

/** Formata com centavos: "R$ 1.840,00" (usado em boletos/extrato detalhado). */
export function formatMoedaCheia(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
