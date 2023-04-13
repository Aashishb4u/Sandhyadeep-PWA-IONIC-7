import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController, NavController} from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";
import {Router} from "@angular/router";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {SwiperComponent, SwiperModule} from 'swiper/angular';
import SwiperCore, {
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFade,
  EffectFlip,
  Keyboard, Navigation, Pagination, Scrollbar, SwiperOptions,
} from 'swiper';
import {ServiceListPage} from "../service-list/service-list.page";
import {MatRippleModule} from "@angular/material/core";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {ProductListPage} from "../product-list/product-list.page";
import {FooterComponentPage} from "../../../shared-components/components/footer-component/footer-component.page";
import {LogoSpinnerPage} from "../../../shared-components/components/logo-spinner/logo-spinner.page";
import {ImageRendererModalPage} from "../../../shared-components/modals/image-renderer-modal/image-renderer-modal.page";
import {interval} from "rxjs";

SwiperCore.use([Scrollbar, Navigation, Pagination, Keyboard, Autoplay, EffectCoverflow, EffectFade, EffectCards, EffectCube, EffectFlip, EffectCreative]);

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    HeaderComponentPage, SwiperModule, ServiceListPage, MatRippleModule,
      SlickCarouselModule, ProductListPage, HeaderComponentPage,
    FooterComponentPage, LogoSpinnerPage]
})
export class AboutUsPage implements OnInit, AfterViewInit {
  @ViewChild('aboutUsSlide', { static: false }) aboutUsSlide?: SwiperComponent;

  banners = [];
  bannerSlideConfig: SwiperOptions = {
    pagination: { type: 'bullets', clickable: true },
    autoplay: true,
    effect: 'flip'
    // navigation: true,
    // loop: true,
  };
  show = true;
  selectedMenu = 'about_us';
  amountPurchased = 0;
  selectedServices = 0;
  productList = [];
  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;

  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: true,
    centeredSlides: true,
    spaceBetween: 10,
    autoHeight: true,
    longSwipes: true,
    autoplay: true,
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 3
  };
  constructor(private sharedService: SharedService,
              private adminService: ApiService,
              public modalController: ModalController,
              private router: Router,
              private navCtrl: NavController) {
  }


  slides = [
    {img: "assets/portfolio/work1.jpg"},
    {img: "assets/portfolio/work2.jpg"},
    {img: "assets/portfolio/work3.jpg"},
    {img: "assets/portfolio/work6.jpg"},
    {img: "assets/portfolio/work7.jpg"}
  ];

  parlourSlides = [
    {imageUrl: "assets/owner-images/sandhyadeep1.png"},
    {imageUrl: "assets/owner-images/sandhyadeep2.png"},
    {imageUrl: "assets/owner-images/sandhyadeep3.png"},
    {imageUrl: "assets/owner-images/sandhyadeep4.png"},
    {imageUrl: "assets/owner-images/sandhyadeep5.png"}
  ];

  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 1500
  };

  dataReturned: any;
  async openModal() {
    const modal = await this.modalController.create({
      component: ImageRendererModalPage,
      componentProps: {
        "paramID": 123,
        "paramTitle": "Test Title"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }

  ngAfterViewInit(): void {
    interval(3000).subscribe(x => {
      if(this.aboutUsSlide.swiperRef.isEnd) {
        this.aboutUsSlide.swiperRef.slideTo(0);
        return;
      }
      this.aboutUsSlide.swiperRef.slideNext(500);
    });
  }

  ngAfterContentChecked(): void {
    this.bannerSlideConfig = {
      pagination: { type: 'bullets', clickable: true },
      autoplay: true,
      effect: 'flip'
    };
  }

  ionViewWillEnter() {
    this.sharedService.showBackIcon.next(true);
  }

  ionViewWillLeave() {
    this.sharedService.showBackIcon.next(false);
  }

  onSelectMenu(key) {
    this.selectedMenu = key;
  }
  ngOnInit() {
  }

  onBookAppointment() {
    console.log('here');
  }


  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }


  //Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((isTrue) => {
      object.isEndSlide = isTrue;
    });
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  addSlide() {
    this.slides.push({img: "http://placehold.it/350x150/777777"})
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  onSeeAllPortfolios() {
    this.router.navigate(['/portfolio']);
  }

  backClicked() {
    this.navCtrl.back();
  }

  updateData(data) {
    this.selectedServices = data.selectedServices;
    this.amountPurchased = data.amountPurchased;
  }
}
