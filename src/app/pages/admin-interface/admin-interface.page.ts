import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActionSheetController, IonicModule} from '@ionic/angular';
import {CommunicationService} from "../../shared-services/admin-services/communication.service";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SharedService} from "../../shared-services/shared.service";

@Component({
  selector: 'app-admin-interface',
  templateUrl: './admin-interface.page.html',
  styleUrls: ['./admin-interface.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, MatIconModule, MatButtonModule]
})
export class AdminInterfacePage implements OnInit {
  userRole: any = '';
  constructor(public communicationService: CommunicationService,
              public sharedService: SharedService
              ) { }
  searchString: any = '';

  onSearch(e) {
    console.log(e);
    this.communicationService.searchEvent.next(e);
  }

  onAdd() {
    const title = this.communicationService.pageTitle.value;
    this.communicationService.addEvent.next(title);
    switch(title) {
      case "Service Types": {

        break;
      }
      case "Services": {
        break;
      }
      case "Sub Services": {
        break;
      }
      case "Users": {
        break;
      }
      case "Packages": {
        break;
      }
      case "Service Assets": {
        break;
      }
      case "Coupons": {
        break;
      }
    }
    console.log();
    this.communicationService.addEvent.next(true);
  }

  ngOnInit() {
    this.userRole = this.sharedService.getUserRole().toLowerCase();
  }

  clearSearch() {
    this.communicationService.searchEvent.next('');
  }
}
