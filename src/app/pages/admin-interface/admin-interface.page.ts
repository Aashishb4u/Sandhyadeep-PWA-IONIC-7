import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActionSheetController, IonicModule} from '@ionic/angular';
import {CommunicationService} from "../../shared-services/admin-services/communication.service";
import {RouterModule} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-admin-interface',
  templateUrl: './admin-interface.page.html',
  styleUrls: ['./admin-interface.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, MatIconModule, MatButtonModule]
})
export class AdminInterfacePage {

  constructor(public communicationService: CommunicationService) { }
  searchString: any = '';

  onSearch(e) {
      this.communicationService.searchEvent.next(e);
  }

  clearSearch() {
    this.communicationService.searchEvent.next('');
  }
}
