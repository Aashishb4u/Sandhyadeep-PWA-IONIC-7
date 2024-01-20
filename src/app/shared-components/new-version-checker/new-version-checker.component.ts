import {Component, Input, OnInit} from '@angular/core';
import {NewVersionCheckerService} from "../../shared-services/new-version-checker.service";
import {IonicModule} from "@ionic/angular";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {SharedService} from "../../shared-services/shared.service";

@Component({
  selector: 'app-new-version-checker',
  templateUrl: './new-version-checker.component.html',
  styleUrls: ['./new-version-checker.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, IonicModule]
})
export class NewVersionCheckerComponent {
  @Input() containerClasses: string;

  constructor(
      public newVersionCheckerService: NewVersionCheckerService,
      public sharedService: SharedService
  ) { }

  applyUpdate(): void {
    this.sharedService.showSpinner.next(true);
    this.newVersionCheckerService.applyUpdate();
  }

}
