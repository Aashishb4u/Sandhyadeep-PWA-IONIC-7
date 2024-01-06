import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {RouterModule} from "@angular/router";
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.page.html',
  styleUrls: ['./footer-component.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class FooterComponentPage implements OnInit {
  runningPlatform: any;
  constructor(public sharedService: SharedService, public apiService: ApiService) {
    this.runningPlatform = this.sharedService.getAppPlatform();
  }

  ngOnInit() {
  }

}
