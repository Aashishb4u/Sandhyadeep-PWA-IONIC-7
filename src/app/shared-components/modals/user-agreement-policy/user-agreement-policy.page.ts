import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController, NavController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-user-agreement-policy',
  templateUrl: './user-agreement-policy.page.html',
  styleUrls: ['./user-agreement-policy.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserAgreementPolicyPage implements OnInit {

  constructor(private modalController: ModalController, private navParams: NavParams) { }
  agreedToTerms = false;
  accessMode = 'write';
  ngOnInit() {
    if(this.navParams.data && this.navParams.data['mode']) {
      this.accessMode = this.navParams.data['mode'];
    }
  }

  ngOnDestroy(): void {
    this.modalController.dismiss();
  }

  cancel() {
    this.modalController.dismiss('cancelled');
  }

  onApprove() {
    this.modalController.dismiss('approved');

  }

}
