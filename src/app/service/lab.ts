export class Equip {
  id: number;
  nome: string;
  tipo: string;
  estado: string;
  potencia: number;
}
export class Lab {
  nome: string;
  consumo: number;
  estado: string;
  equips: Equip[];
  aula: boolean;
}
