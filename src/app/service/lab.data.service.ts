import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Lab, Equip, Regra,Simulacao } from "./lab";

@Injectable({
  providedIn: "root"
})
export class LabDataService {
  public labSource = new BehaviorSubject({ lab: null, key: "" });
  currentLab = this.labSource.asObservable();

  public regraSource = new BehaviorSubject({ regra: null, key: "" });
  currentRegra = this.regraSource.asObservable();

  public simulacaoSource = new BehaviorSubject({ simulacao: null, key: "" });
  currentSimulacao = this.simulacaoSource.asObservable();
  constructor() {}

  changeLab(lab: Lab, key: string) {
    this.labSource.next({ lab: lab, key: key });
  }
  changeRegra(regra: Regra, key: string) {
    this.regraSource.next({ regra: regra, key: key });
  }
  changeSimulacao(simulacao: Simulacao, key: string) {
    this.simulacaoSource.next({ simulacao: simulacao, key: key });
  }
}
