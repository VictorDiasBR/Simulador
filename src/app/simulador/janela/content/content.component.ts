import { Component, OnInit, ViewChild } from "@angular/core";
import { LabService } from "../../../service/lab.service";
import { LabDataService } from "../../../service/lab.data.service";
import { Lab, Equip } from "../../../service/lab";
import { Observable } from "rxjs";
import { MatAccordion } from "@angular/material/expansion";
@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.css"]
})
export class ContentComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  labs: Observable<any>;
  lab: Lab;
  key: string = "";
  equip: Equip[];

  constructor(
    private labService: LabService,
    private labDataService: LabDataService
  ) {}

  ngOnInit(): void {
    this.labs = this.labService.getAll();
    console.log(this.key);
    this.labs.forEach((element) => {
      if (element.key === this.key) {
        console.log(element);
      }
    });

    this.lab = new Lab();
  }
  setKey(key) {
    this.key = key;
  }
}
