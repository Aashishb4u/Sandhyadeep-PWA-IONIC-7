import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import { Platform } from '@ionic/angular';
import {Router} from '@angular/router';
import {StorageService} from "./shared-services/storage.service";
import {SharedService} from "./shared-services/shared.service";
import {ConnectionService} from "ng-connection-service";
import {appConstants} from "../assets/constants/app-constants";
import {MatButtonModule} from "@angular/material/button";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, MatButtonModule],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);
  constructor(
      private platform: Platform,
      private router: Router,
      private ConnectionServiceService: ConnectionService,
      private storageService: StorageService,
      private sharedService: SharedService,
  ) {
    this.storageService.getStoredValue(appConstants.ACCESS_TOKEN_KEY).then((token) => {
      this.sharedService.onLoadToken.next(token);
    });
    this.ConnectionServiceService.monitor().subscribe(isConnected =>  {
      // debugger;
      this.isConnected = isConnected;
      if (this.isConnected.hasNetworkConnection) {
        this.status = "ONLINE";
        // this.router.navigate(['']);
      } else {
        this.status = "OFFLINE";
      }
    });
  }
  status = 'ONLINE';
  isConnected: any = true;

  refreshPage() {
    this.router.navigate(['']);
  }
}
