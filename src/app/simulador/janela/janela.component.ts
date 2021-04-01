import {
  Component,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewContainerRef,
  OnDestroy,
  OnInit
} from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { LabService } from "../../service/lab.service";
import { LabDataService } from "../../service/lab.data.service";
import { Lab, Equip } from "../../service/lab";
import { Observable } from "rxjs";
import { MatAccordion } from "@angular/material/expansion";

@Component({
  selector: "app-janela",
  templateUrl: "./janela.component.html",
  styleUrls: ["./janela.component.css"]
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

  equipsA: any;
  equipsC: any;
  equipsP: any;
  equipsL: any;

  constructor(
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private labService: LabService,
    private labDataService: LabDataService
  ) {}

  ngOnInit(): void {
    this.lab = new Lab();
  }
  ngAfterViewInit() {
    this._portal = new TemplatePortal(
      this._dialogTemplate,
      this._viewContainerRef
    );
    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true
    });
    this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());

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
      }
      this.key = data.key;
    });
  }

  ngOnDestroy() {
    this._overlayRef.dispose();
  }

  openDialog(key: string, lab: Lab) {
    this._overlayRef.attach(this._portal);
    this.labDataService.changeLab(lab, key);
  }
}
