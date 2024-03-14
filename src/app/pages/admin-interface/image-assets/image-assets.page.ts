import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {ApiService} from "../../../shared-services/api.service";
import {ImageAssetModalPage} from "../../../shared-components/modals/image-asset-modal/image-asset-modal.page";
import {appConstants} from "../../../../assets/constants/app-constants";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {InfiniteScrollCustomEvent} from "@ionic/core";

@Component({
  selector: 'app-image-assets',
  templateUrl: './image-assets.page.html',
  styleUrls: ['./image-assets.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatDividerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule]
})
export class ImageAssetsPage implements OnInit {

  constructor(private sharedService: SharedService,
              private alertController: AlertController,
              private communicationService: CommunicationService,
              private adminService: ApiService,
              public modalController: ModalController) { }
  appImages: any = [];
  selectedAppImage: any = null;
  assetLocations: any = ['Banner', 'PortFolio', 'parlour Images', 'Owner Images'];
  limit: any = 3;
  page: any = 1;
  scrollEvent: InfiniteScrollCustomEvent;

  async presentModal(componentData) {
    const modal = await this.modalController.create({
      component: ImageAssetModalPage,
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
      this.getAppImages();
    });
    return await modal.present();
  }

  resetPage() {
    this.page = 1;
    this.appImages = [];
  }

  onEdit(appImage) {
    this.selectedAppImage = appImage;
    this.presentModal(appImage);
  }

  async onDelete(appImage) {
    this.communicationService.showAdminSpinner.next(true);
    const appImageId = appImage.id;
    const alert = await this.alertController.create({
      header: `Do you want to delete ${appImage.name}?`,
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
            this.deleteAppImage(appImageId);
          },
        },
      ]
    });

    await alert.present();
  }

  deleteAppImage(appImageId) {
    this.adminService.deleteAppImage(appImageId).subscribe(
        res => this.deleteAppImageSuccess(res),
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

  deleteAppImageSuccess(res) {
    this.sharedService.presentToast('service Type deleted Successfully.', 'success');
    this.getAppImages();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.communicationService.pageTitle.next('Image Assets');
  }

  ngOnInit() {
    this.communicationService.pageTitle.next('Image Assets');
    this.getAppImages();
    this.communicationService.addEvent.subscribe((res) => {
      if (res === 'Image Assets') {
        this.presentModal({});
      }
    });
  }

  getAppImages() {
    this.adminService.getAllAppImages(this.page, this.limit).subscribe(
        res => this.getAllAppImagesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllAppImagesSuccess(res) {
    if(res.images && res.images.length) {
      this.appImages = this.appImages.concat([...res.images].map((portfolio) => {
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
    this.getAppImages();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
