import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {HeaderComponentPage} from "../../../shared-components/components/header-component/header-component.page";

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: ['./policy.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponentPage]
})
export class PolicyPage implements OnInit {

  constructor(public sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.showBackIcon.next(true);
    this.sharedService.onSettingEvent.next(false);
  }

}
