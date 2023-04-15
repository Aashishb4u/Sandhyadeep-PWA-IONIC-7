import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import {appConstants} from "../../../../assets/constants/app-constants";
import {SharedService} from "../../../shared-services/shared.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {ApiService} from "../../../shared-services/api.service";
import {AdminServiceTypeModalPage} from "../../../shared-components/modals/admin-service-type-modal/admin-service-type-modal.page";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-admin-service-types',
  templateUrl: './admin-service-types.page.html',
  styleUrls: ['./admin-service-types.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatDividerModule, MatButtonModule]
})
export class AdminServiceTypesPage implements OnInit {

  constructor(private sharedService: SharedService, private alertController: AlertController, private communicationService: CommunicationService,
              private adminService: ApiService, public modalController: ModalController) { }
  serviceTypes: any = [];
  selectedServiceType: any = null;
  async presentModal(componentData) {
    const modal = await this.modalController.create({
      component: AdminServiceTypeModalPage,
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
    this.adminService.deleteServiceType(serviceTypeId).subscribe(
        res => this.deleteServiceTypeSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  ionViewWillLeave() {
    this.closeModal();
  }

  async closeModal() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  deleteServiceTypeSuccess(res) {
    this.sharedService.presentToast('service Type deleted Successfully.', 'success');
    this.getMainServices();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.communicationService.pageTitle.next('Service Types');
  }

  ngOnInit() {
    this.communicationService.pageTitle.next('Service Types');
    this.getMainServices();
  }

  getMainServices() {
    this.adminService.getAllServiceTypes().subscribe(
        res => this.getMainServicesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getMainServicesSuccess(res) {
    this.serviceTypes = res;
    if (this.serviceTypes && this.serviceTypes.length) {
      this.serviceTypes = this.serviceTypes.map((ser) => {
        // Adding the api url and also updating image with timestamp
        ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
        return ser;
      });
    }
    console.log(this.serviceTypes, 'this.serviceTypes');
  }

}
