import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class LabsService {
  constructor(public fireservices: AngularFirestore) {}

  create_newLab(Lab) {
    return this.fireservices.collection("labs").add(Lab);
  }

  listarLabs() {
    return this.fireservices.collection("labs").snapshotChanges();
  }

  updateLab(labId, lab) {
    this.fireservices.doc("labs/" + labId).update(lab);
  }
  updateEquip(labId, equipId, lab) {
    this.fireservices.doc("labs/" + labId+"/equips/"+equipId).update(lab);
  }

  deleteLab(labId) {
    this.fireservices.doc("labs/" + labId).delete();
  }
}
