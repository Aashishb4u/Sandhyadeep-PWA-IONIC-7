import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AlertController, ModalController} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {ApiService} from "../../../shared-services/api.service";
import {ImageRendererModalPage} from "../../../shared-components/modals/image-renderer-modal/image-renderer-modal.page";
import {AdminPackageModalPage} from "../../../shared-components/modals/admin-package-modal/admin-package-modal.page";
import {appConstants} from "../../../../assets/constants/app-constants";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-admin-packages',
  templateUrl: './admin-packages.page.html',
  styleUrls: ['./admin-packages.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    MatDividerModule, MatButtonModule]
})
export class AdminPackagesPage implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(private sharedService: SharedService, private alertController: AlertController,
              private communicationService: CommunicationService,
              private adminService: ApiService,
              public modalController: ModalController) { }
  packages: any = [];
  selectedPackageEdit: any = null;
  selectedService: any = null;
  async presentModal(componentData) {
    const modal = await this.modalController.create({
      component: AdminPackageModalPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
      componentProps: componentData
    });
    modal.onWillDismiss().then(() => {
      this.getAllPackages();
    });
    return await modal.present();
  }

  onEdit(serviceType) {
    this.selectedPackageEdit = serviceType;
    this.selectedPackageEdit = this.selectedPackageEdit.services.map((service) => {
      service.imageUrl = `${appConstants.domainUrlApi}${service.imageUrl}?${new Date().getTime()}`;
      return service;
    });
    this.presentModal(serviceType);
  }

  ionViewWillLeave() {
    this.closeModal();
  }

  async closeModal() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  async onDelete(combo) {
    this.communicationService.showAdminSpinner.next(true);
    const id = combo.id;
    const alert = await this.alertController.create({
      header: `Do you want to delete ${combo.name}?`,
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
            this.deletePackage(id);
          },
        },
      ]
    });

    await alert.present();
  }

  deletePackage(id) {
    this.adminService.deletePackage(id).subscribe(
        res => this.deletePackageSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  deletePackageSuccess(res) {
    this.sharedService.presentToast('Package deleted Successfully.', 'success');
    this.getAllPackages();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.communicationService.pageTitle.next('Packages');
    this.getAllPackages();
  }

  ngOnInit() {}

  getAllPackages() {
    this.adminService.getAllPackages().subscribe(
        res => this.getAllPackagesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllPackagesSuccess(res) {
    this.packages = res;
    if (this.packages && this.packages.length) {
      this.packages = this.packages.map((pack) => {
        pack.imageUrl = `${appConstants.domainUrlApi}${pack.imageUrl}?${new Date().getTime()}`;
        pack.totalAmount = pack.services.map(v => +v.price).reduce((a, b) => a + b);
        pack.finalAmount = +pack.totalAmount - +pack.discount;
        pack.totalDuration = pack.services.map(v => +v.duration).reduce((a, b) => a + b);
        if (pack.services && pack.services.length > 0) {
          pack.services = pack.services.map((ser) => {
            ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
            return ser;
          });
        }
        return pack;
      });
    }
  }


  showImage(image) {
    this.openModal(image);
  }


  async openModal(image) {
    const modal = await this.modalController.create({
      component: ImageRendererModalPage,
      componentProps: {
        imageUrl: image
      }
    });

    return await modal.present();
  }

}
