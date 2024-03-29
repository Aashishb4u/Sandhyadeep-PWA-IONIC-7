import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EnvironmentInjector,
  inject,
  ViewEncapsulation
} from '@angular/core';
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
import {ApiService} from "./shared-services/api.service";
import {LogoSpinnerPage} from "./shared-components/components/logo-spinner/logo-spinner.page";
import {FetchDataService} from "./shared-services/fetch-data.service";
import {PushNotificationService} from "./shared-services/push-notification.service";
import '@khmyznikov/pwa-install';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, HttpClientModule, MatButtonModule, LogoSpinnerPage],
})
export class AppComponent implements AfterViewInit {
  public environmentInjector = inject(EnvironmentInjector);
  constructor(
      private platform: Platform,
      private router: Router,
      private ConnectionServiceService: ConnectionService,
      private storageService: StorageService,
      private sharedService: SharedService,
      public pushNotificationService: PushNotificationService,
      private adminService: ApiService, // Do not Remove this
      private fetchData: FetchDataService, // Do not Remove this
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

  ngAfterViewInit() {
    this.pushNotificationService.subscribeToNotifications();
  }

}
