import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {NgOtpInputModule} from 'ng-otp-input';
import {Subscription, timer} from 'rxjs';
import {ApiService} from '../../../shared-services/api.service';
import {SharedService} from '../../../shared-services/shared.service';
import {StorageService} from '../../../shared-services/storage.service';
import {appConstants} from '../../../../assets/constants/app-constants';
import {NgxMatIntlTelInputComponent} from "ngx-mat-intl-tel-input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {UserAgreementPolicyPage} from "../../../shared-components/modals/user-agreement-policy/user-agreement-policy.page";
import {CountDownPipePipe} from "../../../shared-pipes/count-down-pipe.pipe";
import * as moment from "moment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,
    FormsModule, MatButtonModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatCheckboxModule,
    ReactiveFormsModule, NgxMatIntlTelInputComponent, NgOtpInputModule, CountDownPipePipe]
})
export class LoginPage implements OnInit, AfterViewInit, OnDestroy {
  phoneForm!: FormGroup;
  loginForm!: FormGroup;
  todaysDate!: any;
  showBackButton = false;
  countDown: Subscription = new Subscription();
  counter = 300;
  tick = 1000;
  selectedOtp: any = null;
  showButtonSpinner: any = false;
  showOtpSpinner: any = false;
  showPhoneSpinner: any = false;
  oneTimeKey: any = null;
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
  viewMode: any = 'login';
  onlyMobileNumber: any = '';
  isEmailAlertOpen = false;
  @ViewChild('loginImageContainer') loginImageContainer: ElementRef;
  @ViewChild('ngOtpInput', {static: false}) ngOtpInputRef: any;
  constructor(private modalController: ModalController, private alertController: AlertController, private storageService: StorageService,
              public sharedService: SharedService,
              private adminService: ApiService, private renderer: Renderer2, private router: Router, private formBuilder: FormBuilder) {
    this.phoneForm = new FormGroup({
      mobileNumber: new FormControl(undefined),
    });

    this.loginForm = this.formBuilder.group({
      name : new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      dob: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      email: new FormControl({value: '', disabled: false}, [
        Validators.required, Validators.email
      ])
    });
    this.loginForm.get('dob')?.setValue(moment('01/01/2000'));
    this.todaysDate = moment().format();
  }

  startCountDown() {
    this.counter = 300;
  }

  ngAfterViewInit() {
    this.startImageChangeInterval();
  }

  ngOnDestroy() {
    this.viewMode = 'login';
    this.loginForm.reset();
    this.phoneForm.reset();
    this.selectedOtp = null;
    this.showButtonSpinner = false;
    this.showOtpSpinner = false;
    this.showPhoneSpinner = false;
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

  loginWithOtp() {
    this.sharedService.showSpinner.next(true);
    // Logic to remove the country code
    this.onlyMobileNumber = this.phoneForm.get('mobileNumber')!.value.replace(/\D/g, '').slice(-10)
    const data = {
      mobileNo: this.onlyMobileNumber,
    };
    this.adminService.loginWithOtp(data).subscribe(
      res => this.signInApiSuccess(res),
      error => {
        this.adminService.commonError(error);
        this.sharedService.showSpinner.next(false);
      }
    );
  }

  signInApiSuccess(res: any) {
    this.viewMode = 'otp';
    this.showBackButton = true;
    this.oneTimeKey = res.data.oneTimeKey;
    this.startCountDown();
    this.sharedService.showSpinner.next(false);
  }

  ionViewWillEnter() {
    this.viewMode = 'login';
    this.loginForm.reset();
    this.phoneForm.reset();
    this.selectedOtp = null;
    this.showButtonSpinner = false;
    this.showOtpSpinner = false;
    this.showPhoneSpinner = false;
    this.showBackButton = false;
    this.sharedService.onSettingEvent.next(true);
    this.sharedService.onUpdateCart();
    this.storageService.removeStoredItem(appConstants.SELECTED_SERVICES);
  }

  ngOnInit() {
    this.viewMode = 'login';
    this.loginForm.reset();
    this.phoneForm.reset();
    this.selectedOtp = null;
    this.showButtonSpinner = false;
    this.showBackButton = false;
    this.showOtpSpinner = false;
    this.showPhoneSpinner = false;
    this.sharedService.onSettingEvent.next(true);
    this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
    this.phoneForm.get('mobileNumber')!.setValue('');
  }

  onOtpInput(event: any) {
    this.selectedOtp = event;
  }

  verifyOtp() {
    if (!this.selectedOtp) {
      this.sharedService.presentToast('Please Enter Valid OTP', 'error');
      return;
    }
    if (this.showOtpSpinner) { return; }
    this.sharedService.showSpinner.next(true);
    this.showOtpSpinner = true;
    const data = {
      mobileNo: this.onlyMobileNumber,
      otp: this.selectedOtp
    };
    this.adminService.verifyOtp(data).subscribe(
      res => this.verifyOtpSuccess(res),
      error => {
        this.adminService.commonError(error);
        this.sharedService.showSpinner.next(false);
        this.showOtpSpinner = false;
        this.ngOtpInputRef.setValue('');
        this.sharedService.presentToast('Please Enter Valid OTP', 'error');
      }
    );
  }

  verifyOtpSuccess(res: any) {
    this.selectedOtp = null;
    this.sharedService.showSpinner.next(false);
    this.showOtpSpinner = false;
    const userData: any = res.data;
    if (userData.verification.isRegistered) {
      this.router.navigate(['/feed']);
    } else {
      this.viewMode = 'signup';
    }
  }


  async reasonAlert() {
    const alert = await this.alertController.create({
      header: 'Do you want to restart login?',
      cssClass: 'alert-popup',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //nothing
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.viewMode = 'login';
            this.loginForm.reset();
            this.phoneForm.reset();
            this.selectedOtp = null;
            this.showButtonSpinner = false;
            this.showOtpSpinner = false;
            this.showPhoneSpinner = false;
            this.showBackButton = false;
          },
        },
      ]
    });

    await alert.present();
  }

  async resendOtpAlert() {
    const alert = await this.alertController.create({
      header: 'Do you want to resend OTP?',
      cssClass: 'alert-popup',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //nothing
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.selectedOtp = null;
            this.showOtpSpinner = false;
            this.resendOtp();
          },
        },
      ]
    });

    await alert.present();
  }

  resendOtp() {
    let mobileNo = '';
    if(this.phoneForm.get('mobileNumber')!.value) {
      mobileNo = this.phoneForm.get('mobileNumber')!.value.replace(/\D/g, '').slice(-10);
    }
    this.adminService.resendOtp({mobileNo: mobileNo}).subscribe(
      res => {
        this.startCountDown();
        this.ngOtpInputRef.setValue('');
        this.sharedService.presentToast('OTP Resent successfully.', 'success');
        this.showOtpSpinner = false;
      },
      error => {
        this.adminService.commonError(error);
        this.showOtpSpinner = false;
        this.sharedService.showSpinner.next(false);
      }
    );
  }

  async showPolicy() {
    if (this.showPhoneSpinner) return;
    let number = '';
    if(this.phoneForm.get('mobileNumber')!.value) {
      number = this.phoneForm.get('mobileNumber')!.value.replace(/\D/g, '').slice(-10);
    }
    if (number.length !== 10) {
      this.sharedService.presentToast('Please Enter Valid Phone Number', 'error').then();
      this.showPhoneSpinner = false;
      return;
    }
    this.showPhoneSpinner = true;
    const modal = await this.modalController.create({
      component: UserAgreementPolicyPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned!.data === 'approved') {
        this.loginWithOtp();
        return;
      }
      this.showPhoneSpinner = false;
    });
    return await modal.present();
  }

  async onSignUp() {
    if(this.showButtonSpinner) return;
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
      mobileNo: this.onlyMobileNumber,
      dateOfBirth: moment(this.loginForm.get('dob')!.value),
    };
    this.showButtonSpinner = true;
    this.adminService.signUpUser(data, this.oneTimeKey).subscribe(
      res => this.updateUserSuccess(res),
      error => {
        this.showButtonSpinner = false;
        this.sharedService.showSpinner.next(false);
        if (error.status === 409) {
          this.isEmailAlertOpen = true;
        } else {
          this.adminService.commonError(error);
        }
      }
    );
  }

  updateUserSuccess(res: any) {
    this.showButtonSpinner = false;
    this.router.navigate(['/feed']);
  }

}
