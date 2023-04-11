import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import {StorageService} from "../../../shared-services/storage.service";
import {Router, RouterModule} from "@angular/router";
import {SharedService} from "../../../shared-services/shared.service";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";

@Component({
  selector: 'sandhyadeep-header',
  templateUrl: './header-component.page.html',
  styleUrls: ['./header-component.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, MatIconModule,
    MatBadgeModule,]
})
export class HeaderComponentPage implements OnInit {
  hideProfileIcon: any = false;
  searchTerm: any = '';
  showSearchBox: any = false;
  @Input() showBackIcon: any = false;
  // sandhyadeepLogoImage = '/assets/theme-images/Sandhyadeep_logo.png';
  // profileIcon = 'assets/icon/profile-icon.png';
  constructor(private storageService: StorageService, private router: Router, private navCtrl: NavController,
              public sharedService: SharedService) { }

  setFilteredItems(event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.sharedService.onSettingEvent.subscribe((res) => {
      this.hideProfileIcon = res;
    });

    this.sharedService.showSearchBox.subscribe((res) => {
      this.showSearchBox = res;
      this.showBackIcon = res;
    });

    this.sharedService.showBackIcon.subscribe((res) => {
      this.showBackIcon = res;
    });
    this.sharedService.onUpdateCart();
  }

  backClicked() {
    if (this.router.url === '/feed') {
      this.router.navigate(['admin-panel']);
      return;
    }
    this.navCtrl.back();
  }

}
