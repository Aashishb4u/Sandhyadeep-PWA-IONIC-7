import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-star-ratings',
  templateUrl: './star-ratings.page.html',
  styleUrls: ['./star-ratings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StarRatingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
