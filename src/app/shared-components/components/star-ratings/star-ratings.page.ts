import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ToastController} from '@ionic/angular';
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-star-ratings',
  templateUrl: './star-ratings.page.html',
  styleUrls: ['./star-ratings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatExpansionModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule]
})
export class StarRatingsPage implements OnInit {
  @Input('rating') public rating: any = 3;
  @Input('starCount') public starCount: number = 5;
  @Input('color') public color: string = 'accent';
  @Output() ratingUpdated = new EventEmitter<any>();
  ratingArr = [];
  constructor(private snackBar: MatSnackBar, private toastController: ToastController) {
  }


  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating: number) {
    this.presentToast('bottom', 'Thanks for Ratings', 1000, 'ionic-success-toast').then();
    this.ratingUpdated.emit(rating);
    return false;
  }


  async presentToast(toastPosition, toastMessage, toastDuration, customClass) {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: toastDuration,
      position: toastPosition,
      cssClass: customClass
    });
    await toast.present();
  }


  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
