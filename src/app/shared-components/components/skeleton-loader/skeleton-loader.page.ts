import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class SkeletonLoaderPage {
  showSkeletonSpinner: any = false;
  showServicesSkeletonSpinner: any = false;
  constructor(public sharedServiceService: SharedService) { }

}
