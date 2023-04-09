import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-image-renderer-modal',
  templateUrl: './image-renderer-modal.page.html',
  styleUrls: ['./image-renderer-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ImageRendererModalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
