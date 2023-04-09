import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.page.html',
  styleUrls: ['./custom-select.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CustomSelectPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
