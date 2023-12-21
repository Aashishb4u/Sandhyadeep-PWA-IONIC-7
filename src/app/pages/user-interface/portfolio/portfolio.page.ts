import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, IonInfiniteScroll, IonInfiniteScrollContent, ModalController} from '@ionic/angular';
import {ApiService} from "../../../shared-services/api.service";
import {SharedService} from "../../../shared-services/shared.service";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {LogoSpinnerPage} from "../../../shared-components/components/logo-spinner/logo-spinner.page";
import {appConstants} from "../../../../assets/constants/app-constants";
import {ImageRendererModalPage} from "../../../shared-components/modals/image-renderer-modal/image-renderer-modal.page";
import {FooterComponentPage} from "../../../shared-components/components/footer-component/footer-component.page";
import {InfiniteScrollCustomEvent} from "@ionic/core";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponentPage, LogoSpinnerPage, FooterComponentPage]
})
export class PortfolioPage implements OnInit, OnDestroy {

  constructor(private adminService: ApiService, private sharedService: SharedService, public modalController: ModalController) { }
  dataReturned: any;
  changeToggleAnim: any = false;
  portfolios: any = [];
  limit: any = 2;
  page: any = 1;
  totalPages: any = 0;
  scrollEvent: InfiniteScrollCustomEvent;
  ngOnInit() {
    this.getAllPortFolioImages();
  }

  ngOnDestroy() {
    this.portfolios = [];
    this.page = 1;
    this.totalPages = 0;
  }

  onIonInfinite(ev) {
    if(ev) {
      ev.target.disabled = this.totalPages === this.page;
      if(ev.target.disabled) return;
    }
    this.page +=1;
    this.getAllPortFolioImages();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  getAllPortFolioImages() {
    this.sharedService.showSkeletonSpinner.next(true);
    this.adminService.getAllPortfolioImages(this.page, this.limit).subscribe(
        res => this.getAllPortFolioImagesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllPortFolioImagesSuccess(res: any) {
    this.totalPages = res.totalPages;
    if(res.images && res.images.length) {
      this.portfolios = this.portfolios.concat([...res.images].map((portfolio) => {
        portfolio.imageUrl = `${appConstants.domainUrlApi}${portfolio.imageUrl}?${new Date().getTime()}`;
        return portfolio;
      }));
    }
  }

  ionViewDidEnter() {
    this.sharedService.showBackIcon.next(true);
  }

  ionViewWillLeave() {
    this.sharedService.showBackIcon.next(false);
  }

  showImage(image) {
    this.openModal(image);
  }

  async openModal(image) {
    const modal = await this.modalController.create({
      component: ImageRendererModalPage,
      componentProps: {
        "imageUrl": image,
      },
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75],
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }
}
