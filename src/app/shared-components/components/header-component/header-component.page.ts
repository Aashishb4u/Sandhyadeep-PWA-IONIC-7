import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header-component',
  templateUrl: './header-component.page.html',
  styleUrls: ['./header-component.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HeaderComponentPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
