import {
  Component,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewContainerRef,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { LabService } from "../../service/lab.service";
import { LabDataService } from "../../service/lab.data.service";
import { Lab, Equip } from "../../service/lab";
import { Observable } from "rxjs";
import { MatAccordion } from "@angular/material/expansion";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-janela",
  templateUrl: "./janela.component.html",
  styleUrls: ["./janela.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JanelaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any>;
  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  labs: Observable<any>;
  lab: any;
  key: string = "";
  equips: any;

  edit: string = "";
  idEquip: string = "";
  nomeEquip: string = "";
  estadoEquip: string = "";
  tipoEquip: string = "";
  idEquipAnt: string = "";

  nomeLab: string = "";
  estadoLab: string = "";
  consumoLab: string = "";
  aulaLab: string = "";

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private labService: LabService,
    private labDataService: LabDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.lab = new Lab();
  }
  ngAfterViewInit() {
    this.labDataService.currentLab.subscribe((data) => {
      if (data.lab && data.key) {
        this.lab = data.lab;

        var nomes = [];

        data.lab.equips.forEach((element) => {
          nomes.push(element.nome);
        });

        var nomesEquips = [];
        nomes.forEach((item) => {
          var duplicated =
            nomesEquips.findIndex((redItem) => {
              return item === redItem;
            }) > -1;

          if (!duplicated) {
            nomesEquips.push(item);
          }
        });
        this.equips = nomesEquips;
        this.key = data.key;
      }
      if (data.lab && data.key && this.edit === "equip") {
        for (const i of data.lab.equips) {
          if (i.id === this.idEquipAnt) {
            i.id = this.idEquip;
            i.nome = this.nomeEquip;
            i.estado = this.estadoEquip;
            i.tipo = this.tipoEquip;
          }
        }
        this.lab.equips = data.lab.equips;
        this.key = data.key;
        this.labService.update(this.lab, this.key);
        this.edit = "";
      } else if (data.lab && data.key && this.edit === "lab") {
        data.lab.nome = this.nomeLab;
        data.lab.estado = this.estadoLab;
        data.lab.consumo = this.consumoLab;
        if (this.aulaLab === "true" && data.lab.estado === "false") {
          data.lab.aula = true;
          data.lab.estado = true;
        } else if (this.aulaLab === "true") {
          data.lab.aula = true;
        } else if (this.aulaLab === "false") {
          data.lab.aula = false;
        }
        this.lab = data.lab;
        this.key = data.key;
        this.labService.update(this.lab, this.key);
        this.edit = "";
      }
    });
  }

  editEquip(
    key: string,
    lab: Lab,
    idEquip: string,
    nome: string,
    estado: string,
    tipo: string,
    idEquipAnt: string
  ) {
    this.idEquip = idEquip;
    this.nomeEquip = nome;
    this.estadoEquip = estado;
    this.tipoEquip = tipo;
    this.idEquipAnt = idEquipAnt;
    this.edit = "equip";

    this.labDataService.changeLab(lab, key);
  }

  editLab(key: string, lab: Lab, nome, consumo, estado, aula) {
    this.nomeLab = nome;
    this.estadoLab = estado;
    this.consumoLab = consumo;
    this.aulaLab = aula;
    this.edit = "lab";

    this.labDataService.changeLab(lab, key);
  }
}
