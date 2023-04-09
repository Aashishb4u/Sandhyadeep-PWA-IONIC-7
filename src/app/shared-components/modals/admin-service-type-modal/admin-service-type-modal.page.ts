import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-service-type-modal',
  templateUrl: './admin-service-type-modal.page.html',
  styleUrls: ['./admin-service-type-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminServiceTypeModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
