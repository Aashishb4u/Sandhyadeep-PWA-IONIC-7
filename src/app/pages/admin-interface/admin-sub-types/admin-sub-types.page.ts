import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule, ModalController, AlertController} from '@ionic/angular';
import {ApiService} from "../../../shared-services/api.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {SharedService} from "../../../shared-services/shared.service";
import {MatButtonModule} from "@angular/material/button";
import {AdminSubTypeModalPage} from "../../../shared-components/modals/admin-sub-type-modal/admin-sub-type-modal.page";
import {MatDividerModule} from "@angular/material/divider";


@Component({
  selector: 'app-admin-sub-types',
  templateUrl: './admin-sub-types.page.html',
  styleUrls: ['./admin-sub-types.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule, ReactiveFormsModule, MatDividerModule]
})
export class AdminSubTypesPage implements OnInit {

  constructor(private sharedService: SharedService, private alertController: AlertController,
              private communicationService: CommunicationService, private adminService: ApiService, public modalController: ModalController) { }
  subServices: any = [];
  selectedServiceType: any = null;
  async presentModal(componentData) {
    const modal = await this.modalController.create({
      component: AdminSubTypeModalPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
      componentProps: componentData
    });
    modal.onWillDismiss().then(() => {
      this.getMainServices();
    });
    return await modal.present();
  }

  onEdit(serviceType) {
    this.selectedServiceType = serviceType;
    this.presentModal(serviceType);
  }

  async onDelete(serviceType) {
    this.communicationService.showAdminSpinner.next(true);
    const serviceTypeId = serviceType.id;
    const alert = await this.alertController.create({
      header: `Do you want to delete ${serviceType.name}?`,
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
            this.deleteServiceType(serviceTypeId);
          },
        },
      ]
    });

    await alert.present();
  }

  deleteServiceType(serviceTypeId) {
    this.adminService.deleteSubService(serviceTypeId).subscribe(
        res => this.deleteServiceTypeSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  deleteServiceTypeSuccess(res) {
    this.sharedService.presentToast('Sub Service deleted Successfully.', 'success');
    this.getMainServices();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.communicationService.pageTitle.next('Sub Services');
  }

  ionViewWillLeave() {
    this.closeModal();
  }

  async closeModal() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  ngOnInit() {
    this.communicationService.pageTitle.next('Sub Services');
    this.getMainServices();
  }

  getMainServices() {
    this.adminService.getAllSubService().subscribe(
        res => this.getAllSubServiceSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllSubServiceSuccess(res) {
    this.subServices = res;
    console.log(this.subServices, 'this.subServices');
  }
}
