import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import { INTRO_KEY, StorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';
import {EffectCards, EffectCoverflow, EffectCreative, EffectCube, EffectFlip, SwiperOptions} from 'swiper';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Pagination, EffectFade, Swiper } from 'swiper';
SwiperCore.use([Pagination, EffectCoverflow, EffectFade, EffectCards, EffectCube, EffectFlip, EffectCreative]);
import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
  standalone: true,
  imports: [ SwiperModule, IonicModule, CommonModule, FormsModule]
})
export class SlidesPage implements OnInit {
  slideOpts: SwiperOptions = {};
  @Output() onSubmit = new EventEmitter<boolean>();

  slides = [
    {
      title: "Welcome to Sandhyadeep Beauty Parlour App!",
      description: "Discover a world of beauty and wellness at your fingertips. With our app, you can book appointments, explore services, and keep track of your beauty journey.",
      image: "assets/ica-slidebox-img-1.png",
      svg: 'img-1'
    },
    {
      title: "Book Your Appointments with Ease",
      description: "Book appointments at your preferred time with ease. Our app offers a range of convenient time slots for you to choose from. Beauty appointments made simple.",
      image: "assets/ica-slidebox-img-2.png",
      svg: 'img-2'
    }
  ];
  constructor(
      private router: Router) { }

  ngOnInit() {
    this.animation();
  }

  async goToLogin() {
    // await this.storage.setStorage(INTRO_KEY, 'true');
    this.router.navigateByUrl('/auth-screen', { replaceUrl: true });
  }

  animation() {
    this.slideOpts = {
      pagination: { clickable: true },
      keyboard: { enabled: true },
      effect: 'coverflow',
      autoplay: true
    };
  }

  onSlideSubmit() {
    this.router.navigate(['login']);
  }

}
