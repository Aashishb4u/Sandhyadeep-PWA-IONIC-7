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

  constructor(private storageService: StorageService, public sharedService: SharedService, private adminService: ApiService, private router: Router, public modalController: ModalController) { }
  slideOpts = {
    initialSlide: 1,
    slidesPerView: 4,
    spaceBetween: 10,
  };
  packageList = [];

  ngOnInit() {
    this.getPackages();
  }

  ionViewWillEnter() {
    this.sharedService.showBackIcon.next(true);
    this.sharedService.onUpdateCart();
    this.getPackages();
  }

  ionViewWillLeave() {
    this.sharedService.showBackIcon.next(false);
  }

  getPackages() {
    this.sharedService.packages$.subscribe((res) => {
      this.packageList = res;
      this.generateSelectedPackages();
    })
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
