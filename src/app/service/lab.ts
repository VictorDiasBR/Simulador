export class Equip {
  id: number;
  nome: string;
  tipo: string;
  estado: string;
  potencia: number;
  dateTimeOn:string;
}
export class Lab {
  nome: string;
  consumo: number;
  estado: string;
  equips: Equip[];
  aula: boolean;
}
export class Regra {
  laboratorio: string;
  estadoLab: boolean;
  equipamento: string;
  probEquip: number;
}
export class Log {
  labNome?:string;
  equipamento?: any;
  dateTimeOn?: string;
  dateTimeOff?: string;
  inicioSimulacao?: string;
}
export class Simulacao {
  estadoSimulacao: boolean;
  titulo: string;
  descricao: string;
  modalidadeTempo: string;
  modelo: string;
  snapshotLabs: Lab[];
  regras: Regra[];
  log: Log[];
  dateTimeInicio: string;
  periodo?: string;
}
