import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Lab, Equip } from "./lab";
@Injectable({
  providedIn: "root"
})
export class LabDataService {
  public labSource = new BehaviorSubject({ lab: null, key: "" });
  currentLab = this.labSource.asObservable();

  constructor() {}

  changeLab(lab: Lab, key: string) {
    this.labSource.next({ lab: lab, key: key });
  }
}
