import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {HeaderComponentPage} from "../../components/header-component/header-component.page";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponentPage, MatCardModule, MatButtonModule]
})
export class BookingDetailsPage implements OnInit {
  bookingData: any = [];
  showMore = true;

  constructor(
      private sharedService: SharedService,
      private modalController: ModalController,
      private navParams: NavParams
  ) {
  }

  showFullDescription = false;

  toggleServiceDescription(index) {
    this.bookingData.services[index].serviceData.showFullDescription =
        !this.bookingData.services[index].serviceData.showFullDescription;
  }

  togglePackageDescription(index) {
    this.bookingData.packages[index].showFullDescription =
        !this.bookingData.packages[index].showFullDescription;
  }

  ngOnInit() {
    this.bookingData = this.navParams.data['bookingData'];
    this.sharedService.onSettingEvent.next(true);
    this.sharedService.showBackIcon.next(false);
    if (this.bookingData.services && this.bookingData.services.length) {
      this.bookingData.services = this.bookingData.services.map((service) => {
        service.serviceData.showFullDescription = false;
        return service;
      });
    }
    if (this.bookingData.packages && this.bookingData.packages.length) {
      this.bookingData.packages = this.bookingData.packages.map((pack) => {
        pack.showFullDescription = false;
        return pack;
      });
    }
    console.log(this.bookingData);
    this.sharedService.showBackIcon.next(false);
    this.sharedService.onSettingEvent.next(true);
  }

  ngOnDestroy(): void {
    this.sharedService.showBackIcon.next(true);
    this.sharedService.onSettingEvent.next(false);
  }

  async closeModal() {
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }
}
