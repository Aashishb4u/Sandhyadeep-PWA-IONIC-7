import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {ApiService} from "../../../shared-services/api.service";
import {InfiniteScrollCustomEvent} from "@ionic/core";
import {ImageAssetModalPage} from "../../../shared-components/modals/image-asset-modal/image-asset-modal.page";
import {appConstants} from "../../../../assets/constants/app-constants";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {ServiceImageModalPage} from "../../../shared-components/modals/service-image-modal/service-image-modal.page";

@Component({
  selector: 'app-service-images',
  templateUrl: './service-images.page.html',
  styleUrls: ['./service-images.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatDividerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule]
})
export class ServiceImagesPage implements OnInit {

  constructor(private sharedService: SharedService,
              private alertController: AlertController,
              private communicationService: CommunicationService,
              private adminService: ApiService,
              public modalController: ModalController) { }
  services: any = [];
  selectedService: any = null;
  assetLocations: any = ['Banner', 'PortFolio', 'parlour Images', 'Owner Images'];
  limit: any = 20;
  page: any = 1;
  scrollEvent: InfiniteScrollCustomEvent;

  async presentModal(componentData) {
    const modal = await this.modalController.create({
      component: ServiceImageModalPage,
      cssClass: 'admin-modal-class',
      animated: true,
      backdropDismiss: true,
      showBackdrop: true,
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
      componentProps: componentData
    });
    modal.onWillDismiss().then(() => {
      this.resetPage();
      this.getServices();
    });
    return await modal.present();
  }

  resetPage() {
    this.page = 1;
    this.services = [];
  }

  onEdit(service) {
    this.selectedService = service;
    this.presentModal(service);
  }

  async onDelete(service) {
    this.communicationService.showAdminSpinner.next(true);
    const serviceId = service.id;
    const alert = await this.alertController.create({
      header: `Do you want to delete ${service.name}?`,
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
            this.deleteService(serviceId);
          },
        },
      ]
    });

    await alert.present();
  }

  deleteService(serviceId) {
    this.adminService.deleteService(serviceId).subscribe(
        res => this.deleteServiceSuccess(res),
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

  deleteServiceSuccess(res) {
    this.sharedService.presentToast('service Type deleted Successfully.', 'success');
    this.getServices();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.communicationService.pageTitle.next('Image Assets');
  }

  ngOnInit() {
    this.communicationService.pageTitle.next('Image Assets');
    this.getServices();
  }

  getServices() {
    this.adminService.getServices(this.page, this.limit).subscribe(
        res => this.getAllServicesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllServicesSuccess(res) {
    if(res.results && res.results.length) {
      this.services = this.services.concat([...res.results].map((portfolio) => {
        portfolio.imageUrl = `${appConstants.domainUrlApi}${portfolio.imageUrl}?${new Date().getTime()}`;
        return portfolio;
      }));

      if(this.scrollEvent) {
        this.scrollEvent.target.disabled = res.totalPages === this.page;
      }
    }

  }

  onIonInfinite(ev) {
    this.page +=1;
    this.scrollEvent = ev;
    this.getServices();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
