/*
  Calcula quando um orçamento vence.

  Vencimento = data de criação (criadoEm) + validade (em dias).
  Ex: criado em 20/11 com validade 7  ->  vence em 27/11.
*/

// Quantos dias antes do vencimento o orçamento já entra em "vencendo"
export const DIAS_AVISO_VENCIMENTO = 3;

export type StatusValidade =
  | "sem_validade" // não informou dias ou não tem data de criação
  | "valido"       // ainda falta mais que DIAS_AVISO_VENCIMENTO dias
  | "vencendo"     // vence hoje ou nos próximos dias
  | "expirado";    // já passou da data

export type InfoValidade = {
  status: StatusValidade;
  vencimento: Date | null;
  diasRestantes: number; // negativo = dias desde que venceu
  texto: string;         // frase pronta para mostrar na tela
  cor: string;
};

const UM_DIA = 24 * 60 * 60 * 1000;

// criadoEm pode chegar como Timestamp do Firestore, Date, número ou texto
function paraData(valor: any): Date | null {
  if (!valor) return null;
  if (typeof valor.toDate === "function") return valor.toDate();
  if (valor instanceof Date) return valor;
  if (typeof valor.seconds === "number") return new Date(valor.seconds * 1000);
  const data = new Date(valor);
  return isNaN(data.getTime()) ? null : data;
}

// Zera as horas para comparar só os dias
function inicioDoDia(data: Date) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function formatarData(data: Date) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getFullYear()}`;
}

export function calcularValidade(orcamento: any): InfoValidade {
  const dias = parseInt(String(orcamento?.validade ?? "").replace(/\D/g, ""), 10);
  const criadoEm = paraData(orcamento?.criadoEm ?? orcamento?.criado_em);

  if (!dias || dias <= 0 || !criadoEm) {
    return {
      status: "sem_validade",
      vencimento: null,
      diasRestantes: 0,
      texto: "Sem validade definida",
      cor: "#AAA",
    };
  }

  const vencimento = inicioDoDia(new Date(criadoEm.getTime() + dias * UM_DIA));
  const hoje = inicioDoDia(new Date());
  const diasRestantes = Math.round((vencimento.getTime() - hoje.getTime()) / UM_DIA);
  const data = formatarData(vencimento);

  if (diasRestantes < 0) {
    const atraso = Math.abs(diasRestantes);
    return {
      status: "expirado",
      vencimento,
      diasRestantes,
      texto: `Expirou em ${data} (há ${atraso} dia${atraso > 1 ? "s" : ""})`,
      cor: "#FF3B3B",
    };
  }

  if (diasRestantes <= DIAS_AVISO_VENCIMENTO) {
    return {
      status: "vencendo",
      vencimento,
      diasRestantes,
      texto:
        diasRestantes === 0
          ? `Vence hoje (${data})`
          : `Vence em ${diasRestantes} dia${diasRestantes > 1 ? "s" : ""} (${data})`,
      cor: "#FFC107",
    };
  }

  return {
    status: "valido",
    vencimento,
    diasRestantes,
    texto: `Válido até ${data} (${diasRestantes} dias)`,
    cor: "#4CAF50",
  };
}