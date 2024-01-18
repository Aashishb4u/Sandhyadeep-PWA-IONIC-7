import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController, PopoverController} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import * as moment from "moment";
import {ApiService} from "../../../shared-services/api.service";
import {BookingDetailsPage} from "../../../shared-components/modals/booking-details/booking-details.page";
import {BookingPopoverPage} from "../../../shared-components/popovers/booking-popover";
import {InfiniteScrollCustomEvent} from "@ionic/core";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {NgOtpInputModule} from "ng-otp-input";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.page.html',
  styleUrls: ['./bookings-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    MatCardModule, MatProgressBarModule, MatButtonModule, NgOtpInputModule]
})
export class BookingsListPage implements OnInit {
  bookings: any = [];
  services: any = [];
  limit: any = 5;
  page: any = 1;
  selectedBooking: any;
  promptOtp: any = '';
  searchString: any = '';
  totalPages: any = 0;
  isModalOpen: any = false;
  showPhoneSpinner: any = false;
  @ViewChild('ngOtpInput', {static: false}) ngOtpInputRef: any;

  constructor(public sharedService: SharedService,
              private popoverCtrl: PopoverController,
              private modalController: ModalController,
              private communicationService: CommunicationService,
              private adminService: ApiService) { }

  ngOnInit() {
    this.sharedService.showSkeletonSpinner.next(false);
    this.sharedService.showServicesSkeletonSpinner.next(true);
    this.getBookings();
    this.communicationService.placeHolder.next('Search By Booking Id');
    this.communicationService.pageTitle.next('');
    this.communicationService.searchEvent.subscribe((res) => {
      this.searchString = res;
      this.getBookings();
    });
  }

  validateOtp() {
    console.log(this.selectedBooking);
    if(this.promptOtp !== this.selectedBooking.bookingOtp) {
      this.adminService.presentToast('Otp is not valid');
      return;
    }
    const data = {
      bookingOtp: this.promptOtp
    }
    this.adminService.completeBooking(data, this.selectedBooking.id).subscribe(
        (res) => {
          this.modalController.dismiss();
          this.sharedService.presentToast('Booking Completed', 'success');
          this.getBookings();
        },
        (err) => {}
    )
  }

  getBookings() {
    this.adminService.getAllBookings(this.searchString).subscribe(
        res => this.getBookingsSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  // getBookingsSuccess(res) {
  //   this.transformBookingData([...res]);
  // }

  getBookingsSuccess(bookings) {
    let allBookings = [];
    this.bookings = [];
    allBookings = [...bookings].map((val) => {
      val.allPackagesTotalAmount = 0;
      val.allPackagesDiscount = 0;
      val.allPackagesFinalAmount = 0;
      val.allServicesAmount = 0;
      if (val.paymentId && val.paymentId.length > 0) {
        val.paymentData = val.paymentId;
      }
      if (val.packages && val.packages.length) {
        val.packages = val.packages.map((serv) => {
          serv.packageData = serv.packageId;
          return serv;
        });
        val.allPackagesFinalAmount = val.packages.map(v => v.finalAmount).reduce((a, b) => a + b, 0);
        val.allPackagesTotalAmount = val.packages.map(v => v.totalAmount).reduce((a, b) => a + b, 0);
        val.allPackagesDiscount = val.packages.map(v => v.discount).reduce((a, b) => a + b, 0);
      }
      if (val.services && val.services.length) {
        val.allServicesAmount = val.services.map(v => v.price * v.quantity).reduce((a, b) => a + b, 0);
        val.services = val.services.map((serv) => {
          serv.serviceData = serv.serviceId;
          return serv;
        })
      }
      val.checkoutFinalAmount = val.allPackagesFinalAmount + val.allServicesAmount;
      val.checkoutAmount = val.allPackagesTotalAmount + val.allServicesAmount;
      val.checkoutDiscount = val.allPackagesDiscount;
      if(val.couponId) {
        val.checkoutFinalAmount = val.checkoutAmount - val.couponDiscount;
        val.checkoutDiscount += val.couponDiscount;
      }
      val.dateString = `${moment(val.bookingDate).format('DD MMM YYYY')} @${val.timeSlot}`;
      val.showSpinner = false;
      val.isRatingAdded = false;
      return val;
    });
    this.bookings = [...this.bookings, ...allBookings];
    setTimeout(() => {
      this.sharedService.showServicesSkeletonSpinner.next(false);
    }, 1000);
  }

  onEnterOtp(booking) {
    console.log(booking);
    // setTimeout(() => {
    //   this.ngOtpInputRef.setValue(booking.bookingOtp);
    // }, 500);
  }

  async openModal(booking) {
    console.log(booking);
    const modal = await this.modalController.create({
      component: BookingDetailsPage,
      componentProps: {
        bookingData: booking
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned);
    });

    return await modal.present();
  }

  // onIonInfinite(ev) {
  //   if(ev) {
  //     ev.target.disabled = this.totalPages === this.page;
  //     if(ev.target.disabled) return;
  //   }
  //   this.page +=1;
  //   this.getBookings();
  //   setTimeout(() => {
  //     (ev as InfiniteScrollCustomEvent).target.complete();
  //   }, 500);
  // }
}
