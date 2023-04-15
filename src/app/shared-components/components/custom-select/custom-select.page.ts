import {Component, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.page.html',
  styleUrls: ['./custom-select.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatDividerModule]
})
export class CustomSelectPage implements OnInit ,OnDestroy {
  modalTitle: string;
  imageUrl: string;

  title = 'Search';
  data: any = [];
  services: any = [];
  multiple = false;
  itemTextField = 'name';
  // @Output() selectedChanged: EventEmitter<any> = new EventEmitter<any>();

  isOpen = false;
  selected = [];
  filtered = [];

  constructor(
      private modalController: ModalController,
      private navParams: NavParams
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.filtered = this.data;
  }

  select() {
    this.selected = this.data.filter(item => item.selected);
    this.closeModal();
  }

  itemSelected() {
    this.selected = this.data.filter((item) => item.selected);
    if (!this.multiple && this.selected.length) {
      // this.selectedChanged.emit(this.selected);
      this.closeModal();
    }
  }

  filter(event) {
    const filter = event.detail.value.toLowerCase();
    this.data = Array.from(this.services.filter(v => v.name.toLowerCase().includes(filter)));
  }

  ngOnDestroy(): void {
    this.data = [];
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.data = Array.from(this.navParams.data['services']);
    this.services = Array.from(this.navParams.data['services']);
    this.selected = Array.from(this.services.filter((item) => item.selected));
  }

  async closeModal() {
    await this.modalController.dismiss(this.selected);
  }

}
