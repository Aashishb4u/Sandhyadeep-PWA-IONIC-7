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
import {InfiniteScrollCustomEvent} from "@ionic/core";


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
  limit: any = 20;
  page: any = 1;
  totalPages: any = 0;
  searchString: any = '';
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
      this.getSubServices();
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
    this.getSubServices();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.page = 1;
    this.totalPages = 0;
    this.subServices = [];
    this.getSubServices();
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
    this.communicationService.addEvent.subscribe((res) => {
      if (res === 'Sub Services') {
        this.presentModal({});
      }
    });
    this.communicationService.searchEvent.subscribe((res) => {
      console.log(this.communicationService.addEvent);
      this.page = 1;
      this.subServices = [];
      this.totalPages = 0;
      this.searchString = res;
      this.getSubServices();
    })
  }

  getSubServices() {
    this.adminService.getSubServices(this.page, this.limit, this.searchString).subscribe(
        res => this.getAllSubServiceSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllSubServiceSuccess(res) {
    this.totalPages = res.totalPages;
    if(res && res.results && res.results.length) {
      this.subServices = this.subServices.concat([...res.results]);
    }
  }

  onIonInfinite(ev) {
    if(ev) {
      ev.target.disabled = this.totalPages === this.page;
      if(ev.target.disabled) return;
    }
    this.page +=1;
    this.getSubServices();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

}
