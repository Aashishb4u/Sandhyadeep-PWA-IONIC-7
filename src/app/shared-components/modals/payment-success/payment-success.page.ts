import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {StorageService} from "../../../shared-services/storage.service";
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {SharedService} from "../../../shared-services/shared.service";
import {HeaderComponentPage} from "../../components/header-component/header-component.page";

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule, HeaderComponentPage]
})
export class PaymentSuccessPage implements OnInit {
  constructor(private modalController: ModalController, public sharedService: SharedService) {
  }

  ngOnInit() {
    this.sharedService.showBackIcon.next(false);
    this.sharedService.showCart.next(false);
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
    this.sharedService.showBackIcon.next(true);
    this.sharedService.showCart.next(true);
  }


}
