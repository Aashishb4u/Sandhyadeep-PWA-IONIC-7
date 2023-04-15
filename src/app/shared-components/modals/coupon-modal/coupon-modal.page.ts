import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ModalController, NavParams} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../../../shared-services/api.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {SharedService} from "../../../shared-services/shared.service";
import {MatButtonModule} from "@angular/material/button";
import * as moment from "moment";
@Component({
  selector: 'app-coupon-modal',
  templateUrl: './coupon-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule]
})
export class CouponModalPage implements OnInit {

  constructor(private navParams: NavParams,
              private router: Router,
              private adminService: ApiService,
              private communication: CommunicationService,
              private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private modalController: ModalController) {
  }

  selectedImage: any = null;
  imageBase64: any = '';
  imageUrl: any = '';
  couponId: any = '';
  editMode: any = false;
  serviceTypes: any = [];
  adminComponentForm: FormGroup;

  ngOnInit() {
    this.adminComponentForm = this.formBuilder.group({
      name: ['', Validators.required],
      couponLabel: ['', Validators.required],
      serviceTypes: [[], Validators.required],
      expiresOn: [moment('01/01/2000').format(), Validators.required],
      minAmount: [0, Validators.required],
      maxDiscountAmount: [0, Validators.required],
      discountPercent: [0, Validators.required]
    });
    this.getMainServices();
    this.editMode = false;
    if (this.navParams && this.navParams.data && this.navParams.data['id']) {
      this.editMode = true;
      setTimeout(() => {
        this.patchModalData(this.navParams.data);
      }, 500);
    }
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
  }

  ionViewWillLeave() {
    this.editMode = false;
  }

  patchModalData(patchData) {
    const { id, name, discountPercent, minAmount, serviceTypes, expiresOn, couponLabel, maxDiscountAmount } = patchData;
    this.adminComponentForm.patchValue({
      name,
      discountPercent,
      maxDiscountAmount,
      minAmount,
      serviceTypes,
      expiresOn,
      couponLabel,
    });
    this.couponId = id;
  }

  onAddValue() {
    if (this.adminComponentForm.invalid) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    if (this.editMode) {
      this.patchCoupon();
    } else {
      this.createCoupon();
    }
  }

  patchCoupon() {
    const data = {
      ...this.adminComponentForm.value,
    };
    this.adminService.updateCoupon(data, this.couponId).subscribe(
        res => this.createCouponSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createCoupon() {
    const data = {
      ...this.adminComponentForm.value,
    };
    this.adminService.createCoupon(data).subscribe(
        res => this.createCouponSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createCouponSuccess(res) {
    this.sharedService.presentToast(res.message, 'success');
    this.closeModal();
  }

  async closeModal() {
    this.adminComponentForm.reset();
    this.selectedImage = null;
    this.imageBase64 = '';
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  getImageBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageBase64 = reader.result;
    };
  }

}
