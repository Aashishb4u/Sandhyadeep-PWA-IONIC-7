import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {MatButtonModule} from "@angular/material/button";
import {HeaderComponentPage} from "../../components/header-component/header-component.page";
import {FooterComponentPage} from "../../components/footer-component/footer-component.page";
import {SharedService} from "../../../shared-services/shared.service";

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.page.html',
  styleUrls: ['./payment-failure.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule, HeaderComponentPage]
})
export class PaymentFailurePage implements OnInit {

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
