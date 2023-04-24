import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";
import {ActivatedRoute, RouterModule} from "@angular/router";
import SwiperCore, {
  Autoplay,
  EffectCards,
  EffectCoverflow, EffectCreative, EffectCube,
  EffectFade, EffectFlip,
  Keyboard,
  Navigation,
  Pagination,
  Scrollbar
} from "swiper";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {SwiperModule} from "swiper/angular";
import {appConstants} from "../../../../assets/constants/app-constants";
import {StorageService} from "../../../shared-services/storage.service";
SwiperCore.use([Scrollbar, Navigation, Pagination, Keyboard, Autoplay, EffectCoverflow, EffectFade, EffectCards, EffectCube, EffectFlip, EffectCreative]);

@Component({
  selector: 'app-packages-details',
  templateUrl: './packages-details.page.html',
  styleUrls: ['./packages-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponentPage, SwiperModule, RouterModule]
})
export class PackagesDetailsPage implements OnInit {
  constructor(public sharedService: SharedService, private adminService: ApiService,
              private route: ActivatedRoute, public storageService: StorageService) { }
  packageId = null;
  packageList = [];
  selectedPackages = [];
  brands = [];
  skinTypes = [];
  singlePackage: any;
  safetyMeasures = [
    'Masks & Gloves worn throughout the service',
    'Complete Sanitization of all the tools used',
    'Low Contact Service',
    '3-day temperature records of beauticians working'
  ];
  slideOpts = {
    initialSlide: 1,
  };

  ionViewWillLeave() {
    this.sharedService.showBackIcon.next(false);
  }

  ionViewWillEnter() {
    this.sharedService.showBackIcon.next(true);
    this.getPackages();
  }

  ngOnInit() {
   this.getPackages();
  }

  generateSelectedPackages() {
    const packageList = this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) : [];
    const packageIDs = packageList.map(v => v.id);
    this.packageList = this.packageList.map((val) => {
      val.addedInCart = !!packageIDs.includes(val.id);
      return val;
    });
    this.singlePackage = this.packageList.find(v => v.id === this.packageId);
    this.brands = this.singlePackage.services.reduce((acc, service) => {
      acc.push(...service.brands.filter((brand) => !acc.includes(brand)));
      return acc;
    }, []);
    this.skinTypes = this.singlePackage.services.reduce((acc, service) => {
      acc.push(...service.skinTypes.filter((skinType) => !acc.includes(skinType)));
      return acc;
    }, []);

    // this.selectedPackages = this.packageList.filter(v => packageIDs.includes(v.id));
  }

  getPackages() {
    this.route.queryParams.subscribe(params => {
      this.packageId = params['packageId'];
      this.sharedService.packagesSubject.subscribe((res) => {
        this.packageList = res;
        this.generateSelectedPackages();
      });
    });
  }

  addToCart(index) {
    this.singlePackage.addedInCart = !this.singlePackage.addedInCart;
    const selectedPackageList = this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) : [];
    let packageIDs = selectedPackageList.map(v => v.id);
    if (!packageIDs.includes(this.singlePackage.id)) {
      packageIDs = packageIDs.concat(this.singlePackage.id);
    }
    let selectedPackages = this.packageList.filter(v => !!packageIDs.includes(v.id));
    if (this.singlePackage.addedInCart) {
      this.sharedService.presentToast(`${this.singlePackage.name} Package is added in cart`, 'success');
    }
    this.storageService.storeValue(appConstants.SELECTED_PACKAGES, selectedPackages);
  }
}
