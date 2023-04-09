import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-sub-types',
  templateUrl: './admin-sub-types.page.html',
  styleUrls: ['./admin-sub-types.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdminSubTypesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
