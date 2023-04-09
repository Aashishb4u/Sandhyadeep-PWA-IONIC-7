import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.page.html',
  styleUrls: ['./skeleton-loader.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SkeletonLoaderPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
