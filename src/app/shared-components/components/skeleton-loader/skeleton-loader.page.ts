import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.page.html',
  styleUrls: ['./skeleton-loader.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgxSkeletonLoaderModule]
})
export class SkeletonLoaderPage implements OnInit {
  showSkeletonSpinner: any = false;
  constructor(private sharedServiceService: SharedService) { }

  ngOnInit() {
    this.sharedServiceService.showSkeletonSpinner.subscribe((res) => {
      this.showSkeletonSpinner = res;
    });
  }

}
