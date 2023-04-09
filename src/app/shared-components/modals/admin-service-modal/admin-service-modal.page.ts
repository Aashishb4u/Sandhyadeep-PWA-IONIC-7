import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-service-modal',
  templateUrl: './admin-service-modal.page.html',
  styleUrls: ['./admin-service-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminServiceModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
