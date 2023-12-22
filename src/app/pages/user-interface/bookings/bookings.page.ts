import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule, ModalController, PopoverController, ToastController} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {ApiService} from "../../../shared-services/api.service";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {LogoSpinnerPage} from "../../../shared-components/components/logo-spinner/logo-spinner.page";
import {FooterComponentPage} from "../../../shared-components/components/footer-component/footer-component.page";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {StarRatingsPage} from "../../../shared-components/components/star-ratings/star-ratings.page";
import * as moment from 'moment';
import {RouterModule} from "@angular/router";
import {BookingPopoverPage} from "../../../shared-components/popovers/booking-popover";
import {BookingDetailsPage} from "../../../shared-components/modals/booking-details/booking-details.page";
import {MatButtonModule} from "@angular/material/button";
import {SkeletonLoaderPage} from "../../../shared-components/components/skeleton-loader/skeleton-loader.page";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    HeaderComponentPage, LogoSpinnerPage, FooterComponentPage, MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTableModule,
    StarRatingsPage,
    RouterModule,
      MatButtonModule,
    BookingPopoverPage,
    MatSnackBarModule,
      SkeletonLoaderPage,
    MatTabsModule]
})
export class BookingsPage implements OnInit, OnDestroy {
  tab = 'first';
  tabName = 'New Bookings';
  starRating = 0;
  showSpinner = false;
  displayedColumns: string[] = ['serviceName', 'date & Time'];
  bookings: any = [];
  cancelledBookings: any = [];
  pastBookings: any = [];
  futureBookings: any = [];
  filteredBookings: any = [];
  services: any = [];
  handlerMessage = '';
  selectedBookingId = '';
  roleMessage = '';
  selectedToggle: boolean = false;
  constructor(private modalController: ModalController,
              private popoverCtrl: PopoverController,
              private sharedService: SharedService,
              private toastController: ToastController,
              private snackBar: MatSnackBar,
              private adminService: ApiService,
              private alertController: AlertController) {
  }

  slideToggleEvent(event) {
    this.showCancelledBookings(event.detail.checked);
  }

  onRatingsChanged(event, index, booking) {
    if (this.filteredBookings[index].ratings === 0) {
      this.selectedBookingId = booking._id;
      const data = {
        ratings: event,
      }
      this.updateBooking(data);
      // setTimeout(() => {
      //     this.filteredBookings[index].showSpinner = false;
      // }, 1000);
    } else {
      this.presentToast('bottom', 'Ratings have already Added', 1000, 'ionic-error-toast').then();
    }

  }

  ngOnInit() {
    this.sharedService.showSkeletonSpinner.next(false);
    this.sharedService.showServicesSkeletonSpinner.next(true);
    this.getBookings();
  }

  getBookings() {
    const userId = this.sharedService.getUserId();
    this.adminService.getUserBookings(userId).subscribe(
        res => this.getBookingsSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  updateBooking(data) {
    this.adminService.updateBooking(data, this.selectedBookingId).subscribe(
        res => this.updateBookingSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  updateBookingSuccess(res) {
    this.getBookings();
  }

  async presentToast(toastPosition, toastMessage, toastDuration, customClass) {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: toastDuration,
      position: toastPosition,
      cssClass: customClass
    });
    await toast.present();
  }

  ionViewWillEnter() {
    this.sharedService.showSkeletonSpinner.next(false);
    this.sharedService.showServicesSkeletonSpinner.next(true);
    this.sharedService.showBackIcon.next(true);
    this.getBookings();
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Do you want to cancel the Appointment!',
      cssClass: 'alert-popup',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            const data = {
              isCancelled: true,
            };
            this.updateBooking(data);
            // this.reasonAlert();
            this.handlerMessage = 'Alert confirmed';
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }



  getBookingsSuccess(res) {
    this.bookings = res;
    this.getAllServices();
  }

  transformBookingData() {
    this.bookings = this.bookings.map((val) => {
      console.log(val);
      val.allPackagesTotalAmount = 0;
      val.allPackagesDiscount = 0;
      val.allPackagesFinalAmount = 0;
      val.allServicesAmount = 0;
      if (val.packages && val.packages.length) {
        val.allPackagesFinalAmount = val.packages.map(v => v.finalAmount).reduce((a, b) => a + b, 0);
        val.allPackagesTotalAmount = val.packages.map(v => v.totalAmount).reduce((a, b) => a + b, 0);
        val.allPackagesDiscount = val.packages.map(v => v.discount).reduce((a, b) => a + b, 0);
      }
      if (val.services && val.services.length) {
        val.allServicesAmount = val.services.map(v => v.price * v.quantity).reduce((a, b) => a + b, 0);
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
    this.futureBookings = this.bookings.filter(v => !v.isCancelled)
        .filter((val) => {
          const now = moment();
          const dateToCompare = moment(val.bookingDate);
          if (dateToCompare.isSame(now, 'day')) {
            return val;
          } else if (dateToCompare.isAfter(now)) {
            return val;
          }
        });
    this.showCancelledBookings(this.selectedToggle);
    setTimeout(() => {
      this.sharedService.showServicesSkeletonSpinner.next(false);
    }, 1000);
  }

  showCancelledBookings(event) {
    this.filteredBookings = !!(event) ? this.bookings.filter(v => v.isCancelled) : this.bookings.filter(v => !v.isCancelled).filter((val) => {
      const now = moment();
      const dateToCompare = moment(val.bookingDate);
      if (dateToCompare.isBefore(now) && !dateToCompare.isSame(now, 'day')) {
        return val;
      }
    });
  }

  async showPopover(event, bookingId) {
    this.selectedBookingId = bookingId._id;
    const popover = await this.popoverCtrl.create({
      component: BookingPopoverPage,
      event,
    });
    popover.onDidDismiss().then((val) => {
      if (val.data && val.data.isBookingCancelled) {
        this.presentAlert();
      }
    });
    // console.log(dismissResult);
    await popover.present();
  }


  async openModal(booking) {
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

  getAllServices() {
    this.adminService.getAllServices().subscribe(
        res => this.getAllServicesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllServicesSuccess(res) {
    this.services = res;
    this.transformBookingData();
  }

  ngOnDestroy(): void {
    this.sharedService.showServicesSkeletonSpinner.next(false);
  }
}
