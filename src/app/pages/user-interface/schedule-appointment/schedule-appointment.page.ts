import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, ModalController, IonicModule} from '@ionic/angular';
import {ApiService} from "../../../shared-services/api.service";
import {Router, RouterModule} from '@angular/router';
import {forkJoin} from 'rxjs';
import * as moment from 'moment';
import {ApplyCouponPage} from "../../../shared-components/modals/apply-coupon/apply-coupon.page";
import {WindowRefService} from "../../../shared-services/window-ref.service";
import {StorageService} from "../../../shared-services/storage.service";
import {SharedService} from "../../../shared-services/shared.service";
import {PaymentSuccessPage} from "../../../shared-components/modals/payment-success/payment-success.page";
import {PaymentFailurePage} from "../../../shared-components/modals/payment-failure/payment-failure.page";
import {MatRippleModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {AddButtonComponent} from "../../../shared-components/components/add-button/add-button.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {appConstants} from "../../../../assets/constants/app-constants";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {SkeletonLoaderPage} from "../../../shared-components/components/skeleton-loader/skeleton-loader.page";
import {FooterComponentPage} from "../../../shared-components/components/footer-component/footer-component.page";
import {SwiperModule} from "swiper/angular";
@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.page.html',
  styleUrls: ['./schedule-appointment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ApplyCouponPage,
    PaymentSuccessPage, PaymentFailurePage, AddButtonComponent, HeaderComponentPage,
    RouterModule
  ]
})
export class ScheduleAppointmentPage implements OnInit {

  constructor(private alertController: AlertController,
              private modalController: ModalController, private winRef: WindowRefService,
              private storageService: StorageService, private sharedService: SharedService,
              private adminService: ApiService, private router: Router) {
  }

  todayDate: any = '';
  selectedDate: any = '';
  selectedTimeSlot: any = '';
  daysArray: any = [];
  monthName: any = '';
  todayYear: any = '';
  paymentStatus: any = '';
  paymentMethod: any = 'online';
  checkoutCount = 0;
  packageDiscount = 0;
  serviceDiscount = 0;
  checkoutAmount = 0;
  checkoutFinalAmount = 0;
  timeSlots = ['10 AM', '11 AM', '12 PM', '1 PM', '3 PM', '4 PM', '5 PM', '6 PM'];
  selectedServices = [];
  selectedPackages = [];
  services: any = [];
  packages: any = [];
  paymentId: any;
  selectedCouponDetails: any = '';
  couponList = [];
  handlerMessage = '';

  ngOnInit() {
    this.getAllDates();
  }

  getAllDates() {
    this.monthName = moment().format('MMMM');
    this.todayYear = moment().format('YYYY');
    this.todayDate = this.selectedDate = moment();
    const today = moment();
    for (let i = 0; i < 7; i++) {
      const date = today.clone().add(i, 'days');
      this.daysArray.push(date);
    }
  }

  ionViewWillEnter() {
    this.sharedService.showBackIcon.next(true);
    this.getServicesData();
    this.paymentMethod = 'online';
  }

  ionViewWillLeave() {
    this.sharedService.showBackIcon.next(false);
  }

  onChangeDate(day) {
    this.selectedDate = day;
  }

  onChangeSlot(slot) {
    this.selectedTimeSlot = slot;
  }

  getServicesData() {
    // getting Packages
    this.sharedService.packages$.subscribe((responsePackages: any) => {
      this.packages = responsePackages;
      // getting Services
      this.sharedService.services$.subscribe((responseServices: any) => {
        this.services = responseServices;
        if(this.services.length > 0) {
          this.updateSelectedServices();
        }

        if(this.packages.length > 0) {
          this.updateSelectedPackages();
        }

        this.updateFooter();

      });
    });
  }

  updateFooter() {
    let servicesCharges = 0;
    if (this.selectedServices && this.selectedServices.length) {
      servicesCharges = this.selectedServices.map(v => v.price * v.counter).reduce((a, b) => +a + +b);
    }
    let packagesTotalCharges = 0;
    let packagesFinalCharges = 0;
    this.packageDiscount = 0;
    this.packageDiscount = 0;
    if (this.selectedPackages && this.selectedPackages.length) {
      packagesTotalCharges = this.selectedPackages.map(v => v.totalAmount * v.counter).reduce((a, b) => +a + +b);
      packagesFinalCharges = this.selectedPackages.map(v => v.finalAmount * v.counter).reduce((a, b) => +a + +b);
      this.packageDiscount = this.selectedPackages.map(v => +v.discount * v.counter).reduce((a, b) => +a + +b);
      this.packageDiscount = this.selectedPackages.map(v => +v.discount * v.counter).reduce((a, b) => +a + +b);
    }
    this.checkoutAmount = servicesCharges + packagesTotalCharges;
    this.checkoutCount = this.selectedPackages.length + this.selectedServices.length;
  }

  onServiceCounterChange(changeEvent, index) {
    const {counter} = changeEvent;
    const {isCounterZero} = changeEvent;
    if (isCounterZero) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices[index].counter = counter;
    }
    this.storageService.storeValue(appConstants.SELECTED_SERVICES, this.selectedServices);
    if (isCounterZero) { this.routeBack(); }
    this.sharedService.onUpdateCart();
    this.updateFooter();
  }

  routeBack() {
    if (this.sharedService.isBookingCartEmpty()) {
      this.router.navigate(['/services']);
      return;
    }
  }

  onPackageCounterChange(changeEvent, index) {
    const {counter} = changeEvent;
    const {isCounterZero} = changeEvent;
    if (isCounterZero) {
      this.selectedPackages.splice(index, 1);
      this.routeBack();
    } else {
      this.selectedPackages[index].counter = counter;
    }
    this.storageService.storeValue(appConstants.SELECTED_PACKAGES, this.selectedPackages);
    if (isCounterZero) { this.routeBack(); }
    this.sharedService.onUpdateCart();
    this.updateFooter();
  }

  updateSelectedPackages() {
    const packageIds = this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES).map((val) => {
          return {
            packageId: val.id,
            counter: val.counter ? val.counter : 1,
          };
        }) : [];

    this.selectedPackages = packageIds && packageIds.length ? this.packages.filter((val) => {
      return packageIds.find(ser => ser.packageId === val.id);
    }).map((val) => {
      const savedPackage = packageIds.find(ser => ser.packageId === val.id);
      val.showIncludes = false;
      val.counter = savedPackage.counter;
      return val;
    }) : [];

    this.storageService.storeValue(appConstants.SELECTED_PACKAGES, this.selectedPackages);
  }

  updateSelectedServices() {
    const serviceIds = this.storageService.getStorageValue(appConstants.SELECTED_SERVICES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_SERVICES).map((val) => {
          return {
            serviceId: val.id,
            counter: val.counter ? val.counter : 1,
          };
        }) : [];

    this.selectedServices = serviceIds && serviceIds.length ? this.services.filter((val) => {
      return serviceIds.find(ser => ser.serviceId === val.id);
    }).map((val) => {
      const service = serviceIds.find(ser => ser.serviceId === val.id);
      val.showIncludes = false;
      val.counter = service.counter;
      return val;
    }) : [];

    this.storageService.storeValue(appConstants.SELECTED_SERVICES, this.selectedServices);
  }

  onBookAppointment() {
    if (!this.selectedTimeSlot) {
      this.sharedService.presentToast('Please Select Time Slot', 'error');
      return;
    }
    if (this.selectedServices.length === 0 && this.selectedPackages.length === 0) {
      this.sharedService.presentToast('Please Add Services or Packages', 'error');
      return;
    }

    const data = {
      paymentAmount: this.checkoutAmount - (this.packageDiscount + this.serviceDiscount),
      paymentStatus: 'ongoing',
      paymentMethod: this.paymentMethod,
      userId: this.sharedService.getUserId(),
      paymentDate: moment().format(),
    };

    if (this.paymentMethod === 'online') {
      this.onlinePaymentFlow(data);
    }

    if (this.paymentMethod === 'pay_on_service') {
      this.offlinePaymentFlow(data);
    }
  }

  offlinePaymentFlow(data) {
    this.adminService.makeOfflinePayment(data).subscribe(
        res => this.makeOfflinePaymentSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  makeOfflinePaymentSuccess(res) {
    this.paymentId = res.data.id;
    this.createBooking();
  }

  onlinePaymentFlow(data) {
    this.adminService.makeOnlinePayment(data).subscribe(
        res => this.makeOnlinePaymentSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  makeOnlinePaymentSuccess(res) {
    const orderId = res.data.razorpayOrderId;
    const amount = res.data.paymentAmount;
    this.paymentId = res.data.id;
    this.payWithRazor(orderId, amount);
  }

  payWithRazor(paymentOrderId, payAmount) {
    const options: any = {
      key: appConstants.RAZORPAY.KEY,
      amount: payAmount,
      currency: appConstants.RAZORPAY.CURRENCY,
      name: appConstants.RAZORPAY.ORGANIZATION,
      description: appConstants.RAZORPAY.DESCRIPTION,
      image: appConstants.RAZORPAY.LOGO,
      order_id: paymentOrderId,
      modal: {
        escape: false,
      },
      theme: {
        color: appConstants.RAZORPAY.COLOR
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      this.verifyPayment(response);
    });
    options.modal.ondismiss = ((err) => {
      this.openErrorModal();
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  verifyPayment(response) {
    this.adminService.verifyPayment(response, this.paymentId).subscribe(
        res => this.verifyPaymentSuccess(res),
        error => {
          this.adminService.commonError(error);
          this.openErrorModal();
        }
    );
  }

  verifyPaymentSuccess(response) {
    if (response.data.signatureVerification) {
      this.createBooking();
    }
  }

  createBooking() {
    let storedServices = this.sharedService.getServicesInCart();
    storedServices = storedServices.map((val) => {
      return {
        serviceId: val.id,
        quantity: val.counter,
        price: val.price,
      };
    });
    let storedPackages = this.sharedService.getPackagesInCart();
    storedPackages = storedPackages.map((val) => {
      return {
        packageId: val.id,
        quantity: val.counter,
        discount: val.discount,
        finalAmount: val.finalAmount,
        totalAmount: val.totalAmount,
      };
    });
    const data = {
      services: storedServices,
      packages: storedPackages,
      timeSlot: this.selectedTimeSlot,
      bookingDate: moment(this.selectedDate).format(),
      ratings: 0,
      isCancelled: false,
      couponId: null,
      paymentId: this.paymentId
    };
    this.adminService.createBooking(data).subscribe(
        res => this.createBookingSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createBookingSuccess(res) {
    this.openSuccessModal();
  }


  goToCoupons() {
    if (this.selectedPackages.length > 0) {
      this.sharedService.presentToast('Coupons are not Applicable for Packages.', 'error');
      return;
    }
    if (this.selectedServices.length === 0 && this.selectedPackages.length === 0) {
      this.sharedService.presentToast('Please Add Services or Packages', 'error');
      return;
    }
    this.presentModal();
  }

  async openSuccessModal() {
    const modal = await this.modalController.create({
      component: PaymentSuccessPage,
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.storageService.removeStoredItem(appConstants.SELECTED_SERVICES);
      this.storageService.removeStoredItem(appConstants.SELECTED_PACKAGES);
      this.router.navigate(['/bookings']);
    });
    return await modal.present();
  }

  async openErrorModal() {
    const modal = await this.modalController.create({
      component: PaymentFailurePage,
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.router.navigate(['/services']);
    });
    return await modal.present();
  }

  // Coupons ---

  async presentModal() {
    const modal = await this.modalController.create({
      component: ApplyCouponPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
      componentProps: {couponList: this.couponList},
    });
    modal.onWillDismiss().then((res) => {
      if (res.data) {
        this.onApplyCoupon(res.data);
      }
    });
    return await modal.present();
  }

  onApplyCoupon(selectedCouponDetails) {
    const services = this.sharedService.getServicesInCart();
    const serviceDetails = services.map((val) => {
      return {
        id: val.id,
        counter: val.counter,
      };
    });
    const data = {
      couponId: selectedCouponDetails.id,
      services: serviceDetails
    };
    this.adminService.applyCoupons(data).subscribe(
        res => this.applyCouponsSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  applyCouponsSuccess(res) {
    this.selectedCouponDetails = res.data.coupon;
    this.serviceDiscount = res.data.discountAmount ? res.data.discountAmount : 0;
    this.sharedService.presentToast(res.message, 'success');
  }

  onMorePackages() {
    this.selectedCouponDetails = '';
    this.serviceDiscount = 0;
    this.router.navigate(['/packages']);
  }

  async reasonAlert() {
    const alert = await this.alertController.create({
      header: 'Payment Method',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: (data) => {
            if (data[0] && data[0].length > 0) {
              this.paymentMethod = data;
              return true;
            } else {
              this.sharedService.presentToast( 'Please submit reason before cancellation', 'error');
              return false;
            }
          },
        },
      ],
      inputs: [
        {
          type: 'radio',
          label: 'Pay on Service',
          value: 'pay_on_service',
          checked: this.paymentMethod === 'pay_on_service'
        },
        {
          type: 'radio',
          label: 'Online Payment',
          value: 'online',
          checked: this.paymentMethod === 'online'
        }
      ],
    });

    await alert.present();
  }
}
