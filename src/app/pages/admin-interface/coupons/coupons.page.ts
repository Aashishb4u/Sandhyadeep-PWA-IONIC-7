import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import {CouponModalPage} from "../../../shared-components/modals/coupon-modal/coupon-modal.page";
import {SharedService} from "../../../shared-services/shared.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {ApiService} from "../../../shared-services/api.service";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatDividerModule, MatButtonModule]
})
export class CouponsPage implements OnInit {

  constructor(private sharedService: SharedService, private alertController: AlertController,
              private communicationService: CommunicationService,
              private adminService: ApiService, public modalController: ModalController) { }
  coupons: any = [];
  selectedCoupon: any = null;
  async presentModal(componentData) {
    const modal = await this.modalController.create({
      component: CouponModalPage,
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

  onView(coupon) {
    this.selectedCoupon = coupon;
    this.presentModal(coupon);
  }

  async onDelete(coupon) {
    this.communicationService.showAdminSpinner.next(true);
    const couponId = coupon.id;
    const alert = await this.alertController.create({
      header: `Do you want to delete ${coupon.name}?`,
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
            this.deleteCoupon(couponId);
          },
        },
      ]
    });

    await alert.present();
  }

  deleteCoupon(couponId) {
    this.adminService.deleteCoupon(couponId).subscribe(
        res => this.deleteCouponSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  deleteCouponSuccess(res) {
    this.sharedService.presentToast('Coupon deleted Successfully.', 'success');
    this.getMainServices();
    this.communicationService.showAdminSpinner.next(false);
  }

  ionViewWillEnter() {
    this.communicationService.pageTitle.next('Coupons');
  }

  ionViewWillLeave() {
    this.closeModal();
  }

  async closeModal() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  ngOnInit() {
    this.communicationService.pageTitle.next('Coupons');
    this.getMainServices();
    this.communicationService.addEvent.subscribe((res) => {
      if (res === 'Coupons') {
        this.presentModal({});
      }
    });
  }

  getMainServices() {
    this.adminService.getAllCoupon().subscribe(
        res => this.getAllCouponSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllCouponSuccess(res) {
    this.coupons = res;
    console.log(this.coupons, 'this.coupons');
  }


}
