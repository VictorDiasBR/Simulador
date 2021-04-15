import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Lab, Equip, Regra } from "./lab";

@Injectable({
  providedIn: "root"
})
export class LabDataService {
  public labSource = new BehaviorSubject({ lab: null, key: "" });
  currentLab = this.labSource.asObservable();

  public regraSource = new BehaviorSubject({ regra: null, key: "" });
  currentRegra = this.regraSource.asObservable();
  constructor() {}

  changeLab(lab: Lab, key: string) {
    this.labSource.next({ lab: lab, key: key });
  }
  changeRegra(regra: Regra, key: string) {
    this.regraSource.next({ regra: regra, key: key });
  }
}
