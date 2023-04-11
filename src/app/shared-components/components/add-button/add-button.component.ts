import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
@Component({
  selector: 'add-button',
  templateUrl: './add-button.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./add-button.component.scss'],
})
export class AddButtonComponent {
  @Input() counter: any = 0;
  @Output() updateCounter = new EventEmitter<object>();
  @Input() showRemove: any = false;
  constructor() {
  }

  onChange(key) {
    switch (key) {
      case 'plus':
        this.counter = this.counter + 1;
        this.updateCounter.emit({counter: this.counter, isCounterZero: false});
        break;

      case 'minus':
        this.counter = this.counter - 1;
        if (this.counter === 0) {
          this.updateCounter.emit({counter: this.counter, isCounterZero: true});
          return;
        }
        this.updateCounter.emit({counter: this.counter, isCounterZero: false});
        break;
    }
  }

}
