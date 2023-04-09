import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-coupon-modal',
  templateUrl: './coupon-modal.page.html',
  styleUrls: ['./coupon-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CouponModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
