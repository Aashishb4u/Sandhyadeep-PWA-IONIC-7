import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActionSheetController, IonicModule} from '@ionic/angular';
import {CommunicationService} from "../../shared-services/admin-services/communication.service";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-admin-interface',
  templateUrl: './admin-interface.page.html',
  styleUrls: ['./admin-interface.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class AdminInterfacePage implements OnInit {

  constructor(private communicationService: CommunicationService, private actionSheetCtrl: ActionSheetController) { }
  pages: any = [
    {title: 'Service Type'}
  ];
  showProgressBar: any = false;
  pageTitle: any = '';
  ngOnInit() {
    this.communicationService.showAdminSpinner.subscribe((res) => {
      this.showProgressBar = res;
    });

    this.communicationService.pageTitle.subscribe((res) => {
      this.pageTitle = res;
    });
  }
}
