import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-sub-type-modal',
  templateUrl: './admin-sub-type-modal.page.html',
  styleUrls: ['./admin-sub-type-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminSubTypeModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
