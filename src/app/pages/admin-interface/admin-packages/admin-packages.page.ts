import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-packages',
  templateUrl: './admin-packages.page.html',
  styleUrls: ['./admin-packages.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminPackagesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
