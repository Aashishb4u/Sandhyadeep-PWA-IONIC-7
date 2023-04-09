import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.page.html',
  styleUrls: ['./footer-component.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FooterComponentPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
