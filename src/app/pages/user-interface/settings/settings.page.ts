import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {Router, RouterModule} from '@angular/router';
import {AlertController, ModalController} from '@ionic/angular';
import {appConstants} from "../../../../assets/constants/app-constants";
import {StorageService} from "../../../shared-services/storage.service";
import {ApiService} from "../../../shared-services/api.service";
import {SharedService} from "../../../shared-services/shared.service";
import {UserAgreementPolicyPage} from "../../../shared-components/modals/user-agreement-policy/user-agreement-policy.page";
import {AdminUserModalPage} from "../../../shared-components/modals/admin-user-modal/admin-user-modal.page";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule,
    UserAgreementPolicyPage, AdminUserModalPage, HeaderComponentPage, RouterModule]
})
export class SettingsPage implements OnInit{
  handlerMessage = '';
  userDetails: any = {};
  userRole = '';

  constructor(public modalController: ModalController,
              private storageService: StorageService,
              private apiService: ApiService,
              private alertController: AlertController,
              public router: Router,
              private sharedService: SharedService) { }

  ionViewWillEnter() {
    this.sharedService.onSettingEvent.next(true);
    this.sharedService.showBackIcon.next(true);
    this.userDetails = this.storageService.getStorageValue(appConstants.USER_INFO);
    this.userDetails.imageUrl = this.userDetails.imageUrl ?
        `${appConstants.domainUrlApi}${this.userDetails.imageUrl}?${new Date().getTime()}` : '/assets/icon/profile-icon.png';
  }

  ngOnInit(): void {
    this.userRole = this.sharedService.getUserRole().toLowerCase();
  }

  // when Application will leave the page
  ionViewWillLeave() {
    this.sharedService.onSettingEvent.next(false);
    this.sharedService.showBackIcon.next(false);
  }

  async editUserModal() {
    let userData = this.storageService.getStorageValue(appConstants.USER_INFO);
    userData.imageUrl = userData.imageUrl ?
        `${appConstants.domainUrlApi}${userData.imageUrl}?${new Date().getTime()}` : '/assets/icon/profile-icon.png';
    userData.settingEditMode = true;
    const modal = await this.modalController.create({
      component: AdminUserModalPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
      componentProps: userData
    });
    return await modal.present();
  }

  async showPolicy() {
    const modal = await this.modalController.create({
      component: UserAgreementPolicyPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      componentProps: {mode: 'read'}
    });
    return await modal.present();
  }

  onLogout() {
    this.apiService.logout();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Do you want to Logout',
      cssClass: 'alert-popup',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.onLogout();
            this.handlerMessage = 'Alert confirmed';
          },
        },
      ],
    });
    await alert.present();
  }

}
