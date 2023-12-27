import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {StorageService} from "../../../shared-services/storage.service";
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";
import {Router} from "@angular/router";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {appConstants} from "../../../../assets/constants/app-constants";
import {ImageRendererModalPage} from "../../../shared-components/modals/image-renderer-modal/image-renderer-modal.page";
import {InfiniteScrollCustomEvent} from "@ionic/core";

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponentPage]
})
export class PackagesPage implements OnInit {
  selectedPackages = [];
  amountPurchased = 0;
  dataReturned: any;
  limit: any = 2;
  page: any = 1;
  totalPages: any = 0;
  constructor(public apiService: ApiService, private storageService: StorageService, public sharedService: SharedService, private router: Router, public modalController: ModalController) { }
  slideOpts = {
    initialSlide: 1,
    slidesPerView: 4,
    spaceBetween: 10,
  };
  packageList = [];

  ngOnInit() {
    this.getPackages();
    this.sharedService.onUpdateCart();
  }

  ionViewWillEnter() {
    this.sharedService.showBackIcon.next(true);
  }

  ionViewWillLeave() {
    this.sharedService.showBackIcon.next(false);
  }

  getPackages() {
    this.apiService.getPackages(this.page, this.limit).subscribe(
        res => this.getPackagesSuccess(res),
        error => {
          this.apiService.commonError(error);
        }
    );
  }

  getPackagesSuccess(res) {
    this.totalPages = res.totalPages;
    if(res && res.results && res.results.length) {
      this.packageList = this.packageList.concat([...res.results].map((portfolio) => {
        portfolio.imageUrl = `${appConstants.domainUrlApi}${portfolio.imageUrl}?${new Date().getTime()}`;
        portfolio.totalAmount = portfolio.services.map(v => +v.price).reduce((a, b) => a + b);
        portfolio.finalAmount = +portfolio.totalAmount - +portfolio.discount;
        portfolio.totalDuration = portfolio.services.map(v => +v.duration).reduce((a, b) => a + b);
        return portfolio;
      }));
      this.generateSelectedPackages();
    }
  }

  onIonInfinite(ev) {
    if(ev) {
      ev.target.disabled = this.totalPages === this.page;
      if(ev.target.disabled) return;
    }
    this.page +=1;
    this.getPackages();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  generateSelectedPackages() {
    // This is added because if we update the packages on server, It should reflect here.
    const packageList = this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) : [];
    const packageIDs = packageList.map(v => v.id);
    this.packageList = this.packageList.map((val) => {
      val.addedInCart = !!packageIDs.includes(val.id);
      return val;
    });
    this.selectedPackages = this.packageList.filter(v => packageIDs.includes(v.id));
    this.amountPurchased = this.selectedPackages && this.selectedPackages.length ?
        this.selectedPackages.map(v => +v.finalAmount).reduce((a, b) => a + b) : 0;
    this.sharedService.updatePackageTotal.next(this.amountPurchased);
  }

  addToCart(index) {
    this.packageList[index].addedInCart = !this.packageList[index].addedInCart;
    if (this.packageList[index].addedInCart) {
      this.sharedService.presentToast(`${this.packageList[index].name} Package is added in cart`, 'success');
    }
    const selectedPackages = this.packageList.filter(v => !!v.addedInCart);
    this.storageService.storeValue(appConstants.SELECTED_PACKAGES, selectedPackages);
    this.selectedPackages = selectedPackages;
    this.amountPurchased = this.selectedPackages && this.selectedPackages.length ?
        this.selectedPackages.map(v => +v.finalAmount).reduce((a, b) => a + b) : 0;
    this.sharedService.updatePackageTotal.next(this.amountPurchased);
  }

  onBookAppointment() {
    const storedPackages = this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES);
    if (!storedPackages || storedPackages.length === 0) {
      this.sharedService.presentToast('Please add package to Book Appointment', 'error');
      return;
    }
    this.sharedService.onUpdateCart();
    this.router.navigate(['/schedule-appointment']);
  }

  showImage(image) {
    this.openModal(image);
  }


  async openModal(image) {
    const modal = await this.modalController.create({
      component: ImageRendererModalPage,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75],
      componentProps: {
        imageUrl: image
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
      }
    });

    return await modal.present();
  }

  onShowDetails(id) {
    this.router.navigate(['/package-details'], { queryParams: { packageId: id }});
  }

}
