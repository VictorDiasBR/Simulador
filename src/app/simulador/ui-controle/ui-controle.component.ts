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
          var sum2 = 0;
          for (const i of data.lab.equips) {
            if (i.id === this.idEquip) {
              i.estado = "on";
            }
            if (i.estado === "on") {
              sum2 += i.potencia / 1000;
            }
          }
          this.lab.consumo = Number(sum2.toFixed(2));
        } else if (this.estadoEquip === "on") {
          var sum1 = 0;
          for (const i of data.lab.equips) {
            if (i.id === this.idEquip) {
              i.estado = "off";
            }
            if (i.estado === "on") {
              sum1 += i.potencia / 1000;
            }
          }
          this.lab.consumo = Number(sum1.toFixed(2));
        }

        this.lab.equips = data.lab.equips;
        this.key = data.key;
        this.labService.update(this.lab, data.key);
        this.edit = "";
      } else if (data.lab && data.key && this.edit === "lab") {
        if (data.lab.estado === "on" && data.lab.aula === true) {
          this.lab.consumo = 0;
          this.lab.estado = "off";
          this.lab.aula = false;
        } else if (data.lab.estado === "off") {
          this.lab.estado = "on";
          var sum = 0;
          for (const i of data.lab.equips) {
            if (i.estado === "on") {
              sum += i.potencia / 1000;
            }
          }
          this.lab.consumo = Number(sum.toFixed(2));
        } else if (data.lab.estado === "on") {
          this.lab.estado = "off";
          this.lab.consumo = 0;
        }
        this.lab.equips = data.lab.equips;
        this.key = data.key;

        this.labService.update(this.lab, this.key);
        this.edit = "";
      } else if (data.lab && data.key && this.edit === "aula") {
        if (data.lab.aula === false && data.lab.estado === "off") {
          this.lab.aula = true;
          this.lab.estado = "on";
        } else if (data.lab.aula === true) {
          this.lab.aula = false;
        } else if (data.lab.aula === false) {
          this.lab.aula = true;
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
