import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-image-asset-modal',
  templateUrl: './image-asset-modal.page.html',
  styleUrls: ['./image-asset-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ImageAssetModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
