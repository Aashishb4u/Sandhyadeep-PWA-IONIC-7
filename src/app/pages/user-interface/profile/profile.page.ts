import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";
import {LoginPage} from "../../access-pages/login/login.page";
import {SharedService} from "../../../shared-services/shared.service";
import {Router, RouterModule} from "@angular/router";
import {FooterComponentPage} from "../../../shared-components/components/footer-component/footer-component.page";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponentPage, CommonModule, FormsModule, RouterModule, HeaderComponentPage]
})
export class ProfilePage implements OnInit {
  showBtnSpinner: any = false;
  constructor(private router: Router, public sharedService: SharedService, public modalController: ModalController) { }

  ngOnInit() {
    this.sharedService.showBackIcon.next(true);
  }

  ionViewWillEnter() {
    this.sharedService.showBackIcon.next(true);
  }

  async showLoginPage() {
    this.showBtnSpinner = true;
    const modal = await this.modalController.create({
      component: LoginPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      componentProps: {modalView: true}
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.showBtnSpinner = false;
      console.log('here 12345');
      if(dataReturned.data !== 'cancelled') {
        this.router.navigate(['/']);
      }
    });
    return await modal.present();
  }

}
