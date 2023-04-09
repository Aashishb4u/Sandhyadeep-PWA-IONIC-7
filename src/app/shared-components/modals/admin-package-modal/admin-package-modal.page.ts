import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-package-modal',
  templateUrl: './admin-package-modal.page.html',
  styleUrls: ['./admin-package-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminPackageModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
