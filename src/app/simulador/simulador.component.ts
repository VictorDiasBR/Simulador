import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { LabService } from "../service/lab.service";
import { LabDataService } from "../service/lab.data.service";
import { Lab, Equip } from "../service/lab";
import { Observable } from "rxjs";
import { JanelaComponent } from "./janela/janela.component";
import { MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
@Component({
  selector: "app-simulador",
  templateUrl: "./simulador.component.html",
  styleUrls: ["./simulador.component.css"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class SimuladorComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
  }
}
