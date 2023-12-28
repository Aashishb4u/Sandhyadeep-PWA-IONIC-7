import {Component, OnInit, ViewChild} from '@angular/core';
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
import {InfiniteScrollCustomEvent} from "@ionic/core";
import {Content} from "@ionic/core/dist/types/components/content/content";

@Component({
  selector: 'app-admin-packages',
  templateUrl: './admin-packages.page.html',
  styleUrls: ['./admin-packages.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    MatDividerModule, MatButtonModule]
})
export class AdminPackagesPage implements OnInit {
  @ViewChild('packageContent') packageContent: Content;
  // tslint:disable-next-line:max-line-length
  constructor(private sharedService: SharedService, private alertController: AlertController,
              private communicationService: CommunicationService,
              private adminService: ApiService,
              public modalController: ModalController) { }
  packages: any = [];
  selectedPackageEdit: any = null;
  selectedService: any = null;
  limit: any = 2;
  page: any = 1;
  totalPages: any = 0;
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
      this.packages = [];
      this.page = 1;
      this.totalPages = 0;
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
    this.packages = [];
    this.page = 1;
    this.totalPages = 0;
    this.sharedService.presentToast('Package deleted Successfully.', 'success');
    this.getAllPackages();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.page = 1;
    this.totalPages = 0;
    this.packages = [];
    this.getAllPackages();
    this.communicationService.pageTitle.next('Packages');
  }

  ngOnInit() {}

  getAllPackages() {
    this.adminService.getPackages(this.page, this.limit).subscribe(
        res => this.getAllPackagesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllPackagesSuccess(res) {
    this.totalPages = res.totalPages;
    if (res && res.results && res.results.length) {
      this.packages = this.packages.concat([...res.results].map((pack) => {
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
      }));
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

  onIonInfinite(ev) {
    console.log("here");
    if(ev) {
      ev.target.disabled = this.totalPages === this.page;
      if(ev.target.disabled) return;
    }
    this.page +=1;
    this.getAllPackages();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }


}
