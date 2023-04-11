import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.page.html',
  styleUrls: ['./payment-failure.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PaymentFailurePage implements OnInit {

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.closeModal();
    }, 4000);
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

}
