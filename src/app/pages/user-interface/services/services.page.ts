import {Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {StorageService} from "../../../shared-services/storage.service";
import {ApiService} from "../../../shared-services/api.service";
import {Router} from "@angular/router";
import {SharedService} from "../../../shared-services/shared.service";
import {appConstants} from "../../../../assets/constants/app-constants";
import {ServiceListPage} from "../service-list/service-list.page";
import {LogoSpinnerPage} from "../../../shared-components/components/logo-spinner/logo-spinner.page";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {Content} from "@ionic/core/dist/types/components/content/content";

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ServiceListPage, LogoSpinnerPage, HeaderComponentPage]
})
export class ServicesPage {

  constructor(private storageService: StorageService, public sharedService: SharedService, private router: Router, private adminService: ApiService) {
  }
  amountPurchased = 0;
  selectedServices = [];
  isRefreshed = false;
  refreshRate: any = 0;
  @ViewChild('pageContentRef') pageContentRef: Content;

  ionViewWillEnter() {
    this.sharedService.showSearchBox.next(true);
    this.sharedService.showBackIcon.next(true);
    this.refreshRate = Math.random();
  }

  ionViewDidEnter() {
    this.selectedServices = this.storageService.getStorageValue(appConstants.SELECTED_SERVICES);
    this.pageContentRef.scrollToTop();
  }

  ionViewWillLeave() {
    this.sharedService.showSearchBox.next(false);
  }

  refreshPage(event) {
    setTimeout(() => {
      this.isRefreshed = !this.isRefreshed;
      this.selectedServices = [];
      event.target.complete();
    }, 1500);
  }

  onBookAppointment() {
    const storedServices = this.storageService.getStorageValue(appConstants.SELECTED_SERVICES);
    if (!storedServices || storedServices.length === 0) {
      this.sharedService.presentToast('Please add service to Book Appointment', 'error');
      return;
    }
    this.sharedService.onUpdateCart();
    this.router.navigate(['/schedule-appointment']);
  }

  updateData(data) {
    this.storageService.storeValue(appConstants.SELECTED_SERVICES, data.selectedServices);
    this.selectedServices = data.selectedServices;
  }

}
