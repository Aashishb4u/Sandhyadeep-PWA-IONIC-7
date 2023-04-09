import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user-agreement-policy',
  templateUrl: './user-agreement-policy.page.html',
  styleUrls: ['./user-agreement-policy.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserAgreementPolicyPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
