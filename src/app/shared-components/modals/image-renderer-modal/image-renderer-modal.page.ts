import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {SwiperModule} from 'swiper/angular';
import SwiperCore, {
 SwiperOptions,
} from 'swiper';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

SwiperCore.use([]);
@Component({
  selector: 'app-image-renderer-modal',
  templateUrl: './image-renderer-modal.page.html',
  styleUrls: ['./image-renderer-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule, MatIconModule, SwiperModule]
})
export class ImageRendererModalPage implements OnInit {
  modalTitle: string;
  imageUrl: string = '';

  constructor(
      private modalController: ModalController,
      private navParams: NavParams
  ) { }

  slideOptsTest: SwiperOptions = {
    zoom: true
  };
  presentingElement = null;
  imageLoaded: any = false;
  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.imageUrl = this.navParams.data['imageUrl'];
    this.modalTitle = this.navParams.data['paramTitle'];
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }


}
