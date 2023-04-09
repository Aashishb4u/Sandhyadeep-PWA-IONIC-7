import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.page.html',
  styleUrls: ['./admin-services.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminServicesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
