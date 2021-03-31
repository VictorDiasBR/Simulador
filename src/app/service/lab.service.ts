import { Injectable } from "@angular/core";
import { Lab, Equip } from "./lab";
import { AngularFireDatabase } from "@angular/fire/database";

import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root"
})
export class LabService {
  constructor(private db: AngularFireDatabase) {}

  insert(lab: Lab) {
    this.db
      .list("lab")
      .push(lab)
      .then((result: any) => {
        console.log(result.key);
      });
  }
  update(lab: Lab, key: string) {
    this.db
      .list("lab")
      .update(key, lab)
      .catch((error: any) => {
        console.error(error);
      });
  }

  getAll() {
    return this.db
      .list("lab")
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((c) => ({
            key: c.payload.key,
            ...(c.payload.val() as {})
          }));
        })
      );
  }

  delete(key: string) {
    this.db.object("lab/" + key).remove();
  }
}
