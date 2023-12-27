import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {
  AfterContentChecked,
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {interval, Observable} from 'rxjs';
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
  Keyboard,
  Navigation,
  Pagination,
  Scrollbar,
  SwiperOptions,
} from 'swiper';
import {Content} from "@ionic/core/dist/types/components/content/content";
import {forkJoin} from "rxjs";


SwiperCore.use([Scrollbar, Navigation, Pagination, Keyboard, Autoplay, EffectCoverflow, EffectFade, EffectCards, EffectCube, EffectFlip, EffectCreative]);
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [IonicModule, RouterModule, CommonModule, FormsModule, SkeletonLoaderPage,
    HeaderComponentPage, FooterComponentPage, RouterModule, SwiperModule]
})
export class FeedPage implements OnInit, AfterContentChecked, OnDestroy, AfterViewChecked {
  @ViewChild('bannerSlide', { static: false }) bannerSlide?: SwiperComponent;
  @ViewChild('packageSlide', { static: false }) packageSlide?: SwiperComponent;
  @ViewChild('feedPageContent') feedPageContent: Content;
  autoPlay: boolean =  true;
  uiRendered: boolean =  false;
  bannerSlideConfig: SwiperOptions = {
    loop: true,
    initialSlide: 1,
    keyboard: { enabled: true },
    scrollbar: { draggable: true },
    effect: 'coverflow'
  };
  packageSlideOptions: SwiperOptions = {
    loop: true,
    initialSlide: 1,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true,
  };
  packageList = [];
  feedPackages = [];
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
    this.sharedService.onSettingEvent.next(false);
    this.sharedService.showSearchBox.next(false);
    this.sharedService.showBackIcon.next(false);
    this.showSkeleton();
    this.todayYear = (new Date()).getFullYear();
    this.closeSkeleton();
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

  getAllDataAtOnce() {
    const subServices$ = this.adminService.getAllSubService();
    const services$ = this.adminService.getAllServices();
    forkJoin([subServices$, services$]).subscribe(results => {
      this.sharedService.subServicesSubject.next(results[0]);
      this.sharedService.servicesSubject.next(results[1]);
      this.sharedService.showSpinner.next(false);
    });
  }

  ionViewDidEnter() {
    this.feedPageContent.scrollToTop();
    const userData = this.storageService.getStorageValue(appConstants.USER_INFO);
    setTimeout(() => {
      interval(5000).subscribe(x => {
        if(this.bannerSlide.swiperRef.isEnd) {
          this.bannerSlide.swiperRef.slideTo(0, 800);
          return;
        }
        if(this.packageSlide.swiperRef.isEnd) {
          this.packageSlide.swiperRef.slideTo(0, 800);
          return;
        }
        this.bannerSlide.swiperRef.slideNext(800);
        this.packageSlide.swiperRef.slideNext(800);
      });
    }, 3000);
  }

  ngOnInit() {
    this.getServiceTypes();
    this.getPackages();
    this.getAllBannerImages();
  }

  // when all view is rendered and checked (including images)
  ngAfterViewChecked() {
    if (!this.uiRendered) {
      this.closeSkeleton();
      this.uiRendered = true;
    }
  }

  refreshPage(event) {
    setTimeout(() => {
      this.showSkeleton();
      this.getServiceTypes();
      this.getPackages();
      this.getAllBannerImages();
      event.target.complete();
      this.closeSkeleton();
    }, 1000);
  }

  getPackages() {
    this.showSkeleton();
    this.adminService.getAllPackages().subscribe(
        res => this.getAllPackagesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllPackagesSuccess(res) {
    this.packageList = res && res.length > 0 ? res.map((pack) => {
      pack.imageUrl = this.sharedService.getUniqueUrl(pack.imageUrl);
      pack.totalAmount = pack.services.map(v => +v.price).reduce((a, b) => a + b);
      pack.finalAmount = +pack.totalAmount - +pack.discount;
      pack.totalDuration = pack.services.map(v => +v.duration).reduce((a, b) => a + b);
      pack.counter = 1;
      pack.showIncludes = false;
      if (pack.services && pack.services.length > 0) {
        pack.services = pack.services.map((ser) => {
          ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
          return ser;
        });
      }
      return pack;
    }) : [];
    this.feedPackages = [...this.packageList].slice(0, 6);
    console.log(this.feedPackages);
    this.sharedService.packagesSubject.next(this.packageList);
  }

  closeSkeleton() {
    setTimeout(() => {
      this.sharedService.showSkeletonSpinner.next(false);
    }, 1000);
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
    this.banners = res.images;
    this.banners = this.banners.map((banner) => {
      banner.loaded = false;
      banner.imageUrl = `${appConstants.domainUrlApi}${banner.imageUrl}?${new Date().getTime()}`;
      return banner;
    });
  }

  getServiceTypes() {
    this.showSkeleton();
    this.sharedService.cancelRequest$.next();
    this.adminService.getAllServiceTypes().subscribe(
        res => this.getAllServiceTypesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllServiceTypesSuccess(res) {
    let serviceTypes: any = res;
    serviceTypes = serviceTypes.map((ser) => {
      ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
      return ser;
    });
    this.serviceTypesList = serviceTypes;
    this.sharedService.serviceTypesSubject.next(serviceTypes);
    this.getAllDataAtOnce();
  }

  onClickPackage(id) {
    this.router.navigate(['/package-details'], { queryParams: { packageId: id }});
  }

  onKnowMore() {
    this.router.navigate(['/about-us']);
  }


  ngOnDestroy(): void {
    this.closeSkeleton();
  }
}
