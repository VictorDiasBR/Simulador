export class Equip {
  id: number;
  nome: string;
  tipo: string;
  estado: string;
}
export class Lab {
  nome: string;
  consumo: number;
  estado: string;
  equips: Equip[];
  aula: boolean;
}
