import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SharedService} from "../../../shared-services/shared.service";
import {Router} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {AddButtonComponent} from "../../../shared-components/components/add-button/add-button.component";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatCardModule,
    MatProgressBarModule, AddButtonComponent]
})
export class ProductListPage implements OnInit {
  @Input() productList: any;

  constructor(private sharedService: SharedService, private router: Router) { }

  goToProductDetails(id) {
    this.router.navigate(['/product-details'], { queryParams: { productId: id }});
  }

  onUpdateCounter(event, index) {
    this.sharedService.selectedProduct.next([this.productList[index]]);
    this.productList[index].showSpinner = true;
    setTimeout(() => {
      this.productList[index].showSpinner = false;
    }, 1000);
  }
  ngOnInit() {}

}
