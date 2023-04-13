import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IonicModule, ModalController, NavParams, PopoverController} from '@ionic/angular';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-my-popover',
    template: `
    <ion-list>
      <ion-item (click)="onCancelBooking()">
        Cancel Booking
      </ion-item>
    </ion-list>
  `,
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule]
})
export class BookingPopoverPage implements OnInit {
    cancelBooking = false;
    constructor(private popOver: PopoverController,
                private navParams: NavParams) {
    }

    ngOnInit(): void {
        // I am in Oninit
    }

    onCancelBooking() {
        this.cancelBooking = true;
        this.closeModal();
    }

    async closeModal() {
        await this.popOver.dismiss({isBookingCancelled: this.cancelBooking});
    }

}
