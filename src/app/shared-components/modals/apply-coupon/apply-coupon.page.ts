import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-apply-coupon',
  templateUrl: './apply-coupon.page.html',
  styleUrls: ['./apply-coupon.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, MatCardModule]
})
export class ApplyCouponPage implements OnInit {
  couponList = [];
  selectedCouponDetails = {
    id: '',
    discountPercent: 0,
  };

  constructor(private navParams: NavParams,
              private sharedService: SharedService,
              private adminService: ApiService,
              private modalController: ModalController) {
  }

  ngOnInit() {
    this.getCoupons();
    this.sharedService.showBackIcon.next(true);
  }

  getCoupons() {
    let paymentMethods = [];
    if (this.navParams && this.navParams.data && this.navParams.data['paymentMethods']) {
      paymentMethods = this.navParams.data['paymentMethods'];
    }
    const services = this.sharedService.getServicesInCart();
    const serviceDetails = services.map((val) => {
      return {
        id: val.id,
        counter: val.counter,
      };
    });
    this.adminService.getApplicableCoupons({services: serviceDetails, paymentMethods}).subscribe(
        res => this.getApplicableSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getApplicableSuccess(res) {
    this.couponList = res.data;
    this.couponList = this.couponList.map((val) => {
      val.isChecked = false;
      return val;
    });
  }

  ionViewWillEnter() {
    this.sharedService.showBackIcon.next(true);
  }

  async onApplyCoupon() {
    await this.modalController.dismiss(this.selectedCouponDetails);
  }

  async closeModal() {
    await this.modalController.dismiss(null);
  }

  filterCoupons() {

  }

  onSelectCoupon(index) {
    this.selectedCouponDetails = this.couponList[index];
  }
}
