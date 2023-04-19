import {Component, EnvironmentInjector, inject, ViewEncapsulation} from '@angular/core';
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
import {forkJoin} from "rxjs";
import {ApiService} from "./shared-services/api.service";
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
      private adminService: ApiService,
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
    this.getAllDataAtOnce();
  }
  status = 'ONLINE';
  isConnected: any = true;

  refreshPage() {
    this.router.navigate(['']);
  }

  getAllDataAtOnce() {
    const serviceTypes$ = this.adminService.getAllServiceTypes();
    const subServices$ = this.adminService.getAllSubService();
    const services$ = this.adminService.getAllServices();
    const packages$ = this.adminService.getAllPackages();
    forkJoin([serviceTypes$, subServices$, services$, packages$]).subscribe(results => {
      let serviceTypes: any = results[0];
      serviceTypes = serviceTypes.map((ser) => {
        ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
        return ser;
      });

      let packages: any = results[3];
      packages = packages.map((pack) => {
        pack.imageUrl = `${appConstants.domainUrlApi}${pack.imageUrl}?${new Date().getTime()}`;
        pack.totalAmount = pack.services.map(v => +v.price).reduce((a, b) => a + b);
        pack.finalAmount = +pack.totalAmount - +pack.discount;
        pack.totalDuration = pack.services.map(v => +v.duration).reduce((a, b) => a + b);
        pack.counter = 1;
        pack.showIncludes = false;
        if (pack.services && pack.services.length > 0) {
          pack.services = pack.services.map((ser) => {
            ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
            return ser;
          });
        }
        return pack;
      });

      this.sharedService.serviceTypesSubject.next(serviceTypes);
      this.sharedService.subServicesSubject.next(results[1]);
      this.sharedService.servicesSubject.next(results[2]);
      this.sharedService.packagesSubject.next(packages);
    });
  }
}
