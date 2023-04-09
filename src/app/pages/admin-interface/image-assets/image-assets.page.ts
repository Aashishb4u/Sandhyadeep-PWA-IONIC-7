import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-image-assets',
  templateUrl: './image-assets.page.html',
  styleUrls: ['./image-assets.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ImageAssetsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
