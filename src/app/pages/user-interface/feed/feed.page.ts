import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Observable, interval} from 'rxjs';
import {StorageService} from "../../../shared-services/storage.service";
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";
import {appConstants} from "../../../../assets/constants/app-constants";
import {SkeletonLoaderPage} from "../../../shared-components/components/skeleton-loader/skeleton-loader.page";
import {FooterComponentPage} from "../../../shared-components/components/footer-component/footer-component.page";
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
import {Content} from "@ionic/core/dist/types/components/content/content";


SwiperCore.use([Scrollbar, Navigation, Pagination, Keyboard, Autoplay, EffectCoverflow, EffectFade, EffectCards, EffectCube, EffectFlip, EffectCreative]);
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [IonicModule, CommonModule, FormsModule, SkeletonLoaderPage,
    HeaderComponentPage, FooterComponentPage, RouterModule, SwiperModule]
})
export class FeedPage implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('bannerSlide', { static: false }) bannerSlide?: SwiperComponent;
  @ViewChild('packageSlide', { static: false }) packageSlide?: SwiperComponent;
  @ViewChild('feedPageContent') feedPageContent: Content;
  autoPlay: boolean =  true;
  bannerSlideConfig: SwiperOptions = {
    loop: true,
    initialSlide: 1,
    keyboard: { enabled: true },
    scrollbar: { draggable: true },
    effect: 'coverflow',
  };
  packageSlideOptions: SwiperOptions = {
    loop: true,
    initialSlide: 1,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true,
  };
  productImages = [
    {
      name: 'Product 1',
      url: 'assets/product1.jpg',
      price: 345,
      discountedPrice: 355,
      inCart: false,
      addedInCart: 0
    },
    {
      name: 'Product 2',
      url: 'assets/product2.jpeg',
      price: 45,
      discountedPrice: 60,
      inCart: false,
      addedInCart: 0
    },
    {
      name: 'Product 3',
      url: 'assets/product3.jpeg',
      price: 126,
      discountedPrice: 150,
      inCart: false,
      addedInCart: 0
    },
    {
      name: 'Product 4',
      url: 'assets/product4.jpeg',
      price: 324,
      discountedPrice: 387,
      inCart: false,
      addedInCart: 0
    },
  ];
  packageList = [];
  productList = [];
  banners = [];
  serviceTypesList = [];
  todayYear: any;
  bannerAnim1: any = false;
  changeAnim1: any = false;
  changeAnim2: any = false;
  packagesSliderObservable: any = new Observable();
  bannerSliderObservable: any = new Observable();
  constructor(private storageService: StorageService,
              private sharedService: SharedService,
              private router: Router, private adminService: ApiService) {
    console.log('In constructor');
  }

  ionViewWillEnter() {
    this.getServiceTypes();
    // this.sharedService.showSkeletonSpinner.next(true);
    this.getPackages();
    this.getAllBannerImages();
    this.todayYear = (new Date()).getFullYear();
  }



  ngAfterContentChecked(): void {
    this.packageSlideOptions = {
      loop: true,
      initialSlide: 1,
      slidesPerView: 1.5,
      spaceBetween: 20,
      centeredSlides: true,
    };
    this.bannerSlideConfig = {
      loop: true,
      initialSlide: 1,
      keyboard: { enabled: true },
      scrollbar: { draggable: true },
      effect: 'coverflow',
    };
  }

  ionViewDidEnter() {
    this.feedPageContent.scrollToTop();
    this.sharedService.onSettingEvent.next(false);
    this.sharedService.showBackIcon.next(false);
    const userData = this.storageService.getStorageValue(appConstants.USER_INFO);
    setTimeout(() => {
      interval(3000).subscribe(x => {
        if(this.bannerSlide.swiperRef.isEnd) {
          this.bannerSlide.swiperRef.slideTo(0);
          return;
        }
        if(this.packageSlide.swiperRef.isEnd) {
          this.packageSlide.swiperRef.slideTo(0);
          return;
        }
        this.bannerSlide.swiperRef.slideNext(800);
        this.packageSlide.swiperRef.slideNext(800);
      });
    }, 1000);
    this.closeSkeleton();
  }

  ngOnInit() {
    this.getAllBannerImages();
  }

  refreshPage(event) {
    setTimeout(() => {
      this.getServiceTypes();
      event.target.complete();
    }, 1000);
  }

  getPackages() {
    this.showSkeleton();
    this.sharedService.packages$.subscribe((res: any) => {
      this.packageList = res;
      this.closeSkeleton();
    });
  }

  getServicePackageSuccess(res) {
    this.packageList = res;
    this.packageList = this.packageList.map((pack) => {
      pack.imageUrl = `${appConstants.domainUrlApi}${pack.imageUrl}?${new Date().getTime()}`;
      return pack;
    });
  }

  closeSkeleton() {
    setTimeout(() => {
      this.sharedService.showSkeletonSpinner.next(false);
    }, 1000)
  }

  showSkeleton() {
    this.sharedService.showSkeletonSpinner.next(true);
  }

  getAllBannerImages() {
    // this.showSkeleton();
    this.adminService.getAllBannerImages().subscribe(
        res => this.getAllBannerImagesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllBannerImagesSuccess(res) {
    this.closeSkeleton();
    this.banners = res;
    this.banners = this.banners.map((banner) => {
      banner.imageUrl = `${appConstants.domainUrlApi}${banner.imageUrl}?${new Date().getTime()}`;
      return banner;
    });
  }

  getServiceTypes() {
   this.sharedService.serviceTypes$.subscribe((res: any) => {
     this.serviceTypesList = res;
     this.closeSkeleton();
   })
  }

  getAllServiceTypesSuccess(res) {

  }

  onClickPackage(id) {
    this.router.navigate(['/package-details'], { queryParams: { packageId: id }});
  }

  goServices() {
    this.router.navigate(['/services']);
  }

  onKnowMore() {
    this.router.navigate(['/about-us']);
  }

  onUpdateCounter(data, index) {
    this.productImages[index].addedInCart = data;
  }

  ngOnDestroy(): void {
    this.closeSkeleton();
  }
}
