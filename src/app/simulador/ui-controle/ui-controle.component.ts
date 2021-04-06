import { AfterViewInit, Component, OnInit } from "@angular/core";
import { LabService } from "../../service/lab.service";
import { LabDataService } from "../../service/lab.data.service";
import { Lab, Equip } from "../../service/lab";
import { Observable } from "rxjs";
import { JanelaComponent } from "../janela/janela.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-ui-controle",
  templateUrl: "./ui-controle.component.html",
  styleUrls: ["./ui-controle.component.css"]
})
export class UiControleComponent implements OnInit, AfterViewInit {
  color = "#90EE90";
  checked = true;
  checked1 = false;

  mode = true;

  labs: Observable<any>;

  lab: Lab;
  key: string = "";
  equip: Equip[];

  idEquip: string = "";
  estadoEquip: string = "";
  edit: string = "";

  constructor(
    private labService: LabService,
    private labDataService: LabDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.labs = this.labService.getAll();
    this.lab = new Lab();
  }

  ngAfterViewInit() {
    this.labDataService.currentLab.subscribe((data) => {
      this.lab = new Lab();
      if (data.lab && data.key && this.edit === "equip") {
        if (this.estadoEquip === "off") {
          for (const i of data.lab.equips) {
            if (i.id === this.idEquip) {
              i.estado = "on";
            }
          }
          console.log("editEquip-if - 1");
        } else if (this.estadoEquip === "on") {
          for (const i of data.lab.equips) {
            if (i.id === this.idEquip) {
              i.estado = "off";
            }
          }
          console.log("editEquip-if - 2");
        }

        this.lab.equips = data.lab.equips;
        this.key = data.key;
        this.labService.update(this.lab, this.key);
        this.edit = "";
      } else if (data.lab && data.key && this.edit === "lab") {
        if (data.lab.estado === "on" && data.lab.aula === true) {
          this.lab.estado = "off";
          this.lab.aula = false;
          console.log("editLab -if - 1");
        } else if (data.lab.estado === "off") {
          this.lab.estado = "on";
          console.log("editLab -if - 2");
        } else if (data.lab.estado === "on") {
          this.lab.estado = "off";
          for (const i of data.lab.equips) {
            i.estado = "off";
          }
          console.log("editLab-if - 3");
        }
        this.lab.equips = data.lab.equips;
        this.key = data.key;

        this.labService.update(this.lab, this.key);
        this.edit = "";
      } else if (data.lab && data.key && this.edit === "aula") {
        if (data.lab.aula === false && data.lab.estado === "off") {
          this.lab.aula = true;
          this.lab.estado = "on";
          console.log("editAula - 1");
        } else if (data.lab.aula === true) {
          this.lab.aula = false;
          console.log("editAula - 2");
        } else if (data.lab.aula === false) {
          this.lab.aula = true;
          console.log("editAula - 3");
        }

        this.key = data.key;

        this.labService.update(this.lab, this.key);
        this.edit = "";
      }
    });
  }

  criarLab() {
    this.labs.forEach((element) => {
      this.labService.insert(element);
    });
  }

  editEquip(key: string, lab: Lab, idEquip?, estadoEquip?) {
    this.idEquip = idEquip;
    this.estadoEquip = estadoEquip;
    this.edit = "equip";
    this.labDataService.changeLab(lab, key);
  }
  editLab(key: string, lab: Lab) {
    this.edit = "lab";
    this.labDataService.changeLab(lab, key);
  }
  editAula(key: string, lab: Lab) {
    this.edit = "aula";
    this.labDataService.changeLab(lab, key);
  }

  deleteLab() {}

  openDialog(key: string, lab: Lab) {
    this.dialog.open(JanelaComponent);

    this.labDataService.changeLab(lab, key);
  }
}
