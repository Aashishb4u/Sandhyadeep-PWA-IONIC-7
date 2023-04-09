import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-packages-details',
  templateUrl: './packages-details.page.html',
  styleUrls: ['./packages-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PackagesDetailsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
