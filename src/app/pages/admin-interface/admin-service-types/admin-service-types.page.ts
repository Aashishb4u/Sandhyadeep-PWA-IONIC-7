import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-service-types',
  templateUrl: './admin-service-types.page.html',
  styleUrls: ['./admin-service-types.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminServiceTypesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
