import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-complete-booking',
  templateUrl: './complete-booking.page.html',
  styleUrls: ['./complete-booking.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CompleteBookingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
