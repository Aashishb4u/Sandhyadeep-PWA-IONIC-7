import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-user-modal',
  templateUrl: './admin-user-modal.page.html',
  styleUrls: ['./admin-user-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminUserModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
