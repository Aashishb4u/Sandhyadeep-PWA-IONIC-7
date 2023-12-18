import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import {StorageService} from "../../../shared-services/storage.service";
import {Router, RouterModule} from "@angular/router";
import {SharedService} from "../../../shared-services/shared.service";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'sandhyadeep-header',
  templateUrl: './header-component.page.html',
  styleUrls: ['./header-component.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, MatIconModule,
    MatBadgeModule,]
})
export class HeaderComponentPage implements OnInit, OnDestroy {
  searchTerm: any = '';
  showSearchBox: any = false;
  @Input() showBackIcon: any = false;
  runningPlatform: any;
  // sandhyadeepLogoImage = '/assets/theme-images/Sandhyadeep_logo.png';
  // profileIcon = 'assets/icon/profile-icon.png';
  constructor(private storageService: StorageService, private router: Router, private navCtrl: NavController,
              public sharedService: SharedService) {
    this.runningPlatform = this.sharedService.getAppPlatform();
  }

  setFilteredItems(event) {
    console.log(event);
  }

  ngOnInit(): void {

    this.sharedService.showBackIcon.subscribe((res) => {
      this.showBackIcon = res;
    });

    this.sharedService.onUpdateCart();
  }

  ngOnDestroy() {
    // this.sharedService.onSettingEvent.unsubscribe();
    // this.sharedService.showSearchBox.unsubscribe();
    // this.sharedService.showBackIcon.unsubscribe();
  }

  backClicked() {
    if (this.router.url === '/feed') {
      this.router.navigate(['admin-panel']);
      return;
    }
    this.navCtrl.back();
  }

}
