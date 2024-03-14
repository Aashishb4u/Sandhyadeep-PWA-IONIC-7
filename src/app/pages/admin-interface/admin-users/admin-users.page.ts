import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import {StorageService} from "../../../shared-services/storage.service";
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {AdminUserModalPage} from "../../../shared-components/modals/admin-user-modal/admin-user-modal.page";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import * as moment from 'moment';
import {appConstants} from "../../../../assets/constants/app-constants";
import {InfiniteScrollCustomEvent} from "@ionic/core";

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatDividerModule]
})
export class AdminUsersPage implements OnInit {
  usersList: any = [];
  selectedUser = null;
  limit: any = 5;
  page: any = 1;
  searchString: any = '';
  totalPages: any = 0;
  constructor(private storageService: StorageService,
              private sharedService: SharedService,
              private alertController: AlertController,
              private adminService: ApiService,
              private communicationService: CommunicationService,
              public modalController: ModalController) { }

  async presentModal(userData) {
    const modal = await this.modalController.create({
      component: AdminUserModalPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
      componentProps: userData
    });
    modal.onWillDismiss().then(() => {
      this.usersList = [];
      this.page = 1;
      this.totalPages = 0;
      this.getAllUserDetails();
    });
    return await modal.present();
  }

  onEdit(userData) {
    console.log(userData);
    this.selectedUser = userData;
    this.presentModal(userData);
  }

  ionViewWillEnter() {
    this.communicationService.pageTitle.next('Users');
  }

  ionViewWillLeave() {
    this.closeModal();
  }

  async closeModal() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  ngOnInit() {
    this.communicationService.searchEvent.subscribe((res) => {
      this.page = 1;
      this.totalPages = 0;
      this.usersList = [];
      this.searchString = res;
      this.getAllUserDetails();
    });
    this.communicationService.pageTitle.next('Users');
    this.getAllUserDetails();
    this.communicationService.addEvent.subscribe((res) => {
      if (res === 'Users') {
        this.presentModal({});
      }
    });
  }


  getAllUserDetails() {
    this.adminService.getUserPaginate(this.page, this.limit, this.searchString).subscribe(
        res => this.getUserDetailsSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getUserDetailsSuccess(res) {
    this.totalPages = res.totalPages;
    if (res && res.results && res.results.length) {
      this.usersList = this.usersList.concat([...res.results].map((user) => {
        user.dateOfBirth = moment(new Date(user.dateOfBirth)).format('DD/MM/YYYY');
        user.age = moment().diff(user.dateOfBirth, 'years',false);
        user.imageUrl = user.imageUrl ? `${appConstants.domainUrlApi}${user.imageUrl}?${new Date().getTime()}` : user.imageUrl;
        return user;
      }));
    }
  }


  async onDelete(userData) {
    this.communicationService.showAdminSpinner.next(true);
    const userDataId = userData.id;
    const alert = await this.alertController.create({
      header: `Do you want to delete ${userData.name}?`,
      cssClass: 'alert-popup',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.communicationService.showAdminSpinner.next(false);
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.deleteService(userDataId);
          },
        },
      ]
    });

    await alert.present();
  }

  deleteService(serviceTypeId) {
    this.usersList = [];
    this.page = 1;
    this.totalPages = 0;
    this.adminService.deleteUser(serviceTypeId).subscribe(
        res => this.deleteUserSuccess(res),
        error => {
          this.adminService.commonError(error);
          this.communicationService.showAdminSpinner.next(false);
          this.getAllUserDetails();
        }
    );
  }

  deleteUserSuccess(res) {
    this.sharedService.presentToast('User deleted Successfully.', 'success');
    this.getAllUserDetails();
    this.communicationService.showAdminSpinner.next(false);
  }

  onIonInfinite(ev) {
    console.log("here");
    if(ev) {
      ev.target.disabled = this.totalPages === this.page;
      if(ev.target.disabled) return;
    }
    this.page +=1;
    this.getAllUserDetails();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
