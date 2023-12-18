import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertController, IonicModule} from '@ionic/angular';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {StorageService} from "../../../shared-services/storage.service";
import {ApiService} from "../../../shared-services/api.service";
import {SharedService} from "../../../shared-services/shared.service";
import {Router} from "@angular/router";
import {FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {appConstants} from "../../../../assets/constants/app-constants";
import * as moment from "moment";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatCheckboxModule, ReactiveFormsModule]
})
export class SignUpPage implements OnInit, AfterViewInit, OnDestroy {

  loginForm!: FormGroup;
  handlerMessage: string = '';
  todaysDate!: any;
  showButtonSpinner: any = false;
  imageArray: string[] = [
    '/assets/theme-images/login-bg-1.jpg',
    '/assets/theme-images/login-bg-3.jpg',
    '/assets/theme-images/login-bg-2.jpg',
    '/assets/theme-images/login-bg-4.jpg',
    '/assets/theme-images/login-bg-6.jpg',
    '/assets/theme-images/login-bg-5.jpg',
    // Add more image URLs as needed
  ];
  currentIndex = 0;
  intervalId: any;
  @ViewChild('loginImageContainer') loginImageContainer: ElementRef;
  constructor(private storageService: StorageService, private apiService: ApiService, private alertController: AlertController,
              private sharedService: SharedService, private renderer: Renderer2,
              private router: Router, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      name : new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      dob: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      email: new FormControl({value: '', disabled: false}, [
        Validators.required, Validators.email
      ]),
      isWhatsAppAvailable: new FormControl({value: false, disabled: false}, [
        Validators.required
      ])
    });
    this.loginForm.get('dob')?.setValue(moment('01/01/2000').format());
    this.todaysDate = moment().format();
  }

  ngAfterViewInit() {
    this.startImageChangeInterval();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startImageChangeInterval() {
    this.intervalId = setInterval(() => {
      // This logic is best
      this.currentIndex = (this.currentIndex + 1) % this.imageArray.length;
      const imageUrl = this.imageArray[this.currentIndex];
      this.renderer.setStyle(this.loginImageContainer.nativeElement, 'background', `url(${imageUrl})`);
      this.renderer.setStyle(this.loginImageContainer.nativeElement, 'background-size', `cover`);
    }, 4000); // Change image every 2 seconds
  }

  async onSignUp() {
    if(this.showButtonSpinner) { return; }
    if (this.loginForm.get('email').invalid) {
      await this.sharedService.presentToast('Please enter valid Email', 'error');
      return;
    }
    if (this.loginForm.invalid) {
      await this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    const data = {
      name: this.loginForm.get('name')!.value,
      email: this.loginForm.get('email')!.value,
      isWhatsAppAvailable: this.loginForm.get('isWhatsAppAvailable')!.value,
      dateOfBirth: moment(this.loginForm.get('dob')!.value).format('DD/MM/YYYY'),
    };
    this.showButtonSpinner = true;
    // const userId = this.sharedService.getUserId();
    const userInfo: any = await this.storageService.getStoredValue(appConstants.USER_INFO);
    this.apiService.updateUser(data, userInfo.id).subscribe(
        res => this.updateUserSuccess(res),
        error => {
          this.apiService.commonError(error);
          this.sharedService.showSpinner.next(false);
        }
    );
  }

  updateUserSuccess(res: any) {
    this.storageService.storeValue(appConstants.USER_INFO, res.data.userData);
    this.showButtonSpinner = false;
    this.router.navigate(['/feed']);
  }

  async reasonAlert() {
    const alert = await this.alertController.create({
      header: 'Do you want to re-submit your phone number?',
      cssClass: 'alert-popup',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // res-submitted
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.apiService.isAuthenticated.next(false);
            this.storageService.removeStoredItem(appConstants.REFRESH_TOKEN_KEY);
            this.storageService.removeStoredItem(appConstants.ACCESS_TOKEN_KEY);
            this.storageService.removeStoredItem(appConstants.USER_INFO);
            this.router.navigate(['login']);
            this.handlerMessage = 'Alert confirmed';
            this.loginForm.reset();
          },
        },
      ]
    });

    await alert.present();
  }

  onBackButton() {
    this.reasonAlert();
  }
}
