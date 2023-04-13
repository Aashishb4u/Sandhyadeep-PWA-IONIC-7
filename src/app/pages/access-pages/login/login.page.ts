import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertController, IonicModule, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import {NgOtpInputModule} from 'ng-otp-input';
import {Subscription, timer} from 'rxjs';
import {ApiService} from '../../../shared-services/api.service';
import {SharedService} from '../../../shared-services/shared.service';
import {StorageService} from '../../../shared-services/storage.service';
import {appConstants} from '../../../../assets/constants/app-constants';
import {CountDownPipePipe} from "../../../shared-pipes/count-down-pipe.pipe";
import {NgxMatIntlTelInputComponent} from "ngx-mat-intl-tel-input";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {UserAgreementPolicyPage} from "../../../shared-components/modals/user-agreement-policy/user-agreement-policy.page";
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
export class LoginPage implements OnInit {
  phoneForm!: FormGroup;
  otpForm!: FormGroup;
  separateDialCode = false;
  showBackButton = false;
  userId = '';
  showLogo = true;
  countDown: Subscription = new Subscription();
  counter = 300;
  tick = 1000;
  phoneNumberSubmitted: any = false;
  selectedOtp: any = null;
  @ViewChild('ngOtpInput', {static: false}) ngOtpInputRef: any;
  constructor(private modalController: ModalController, private alertController: AlertController, private storageService: StorageService, private sharedService: SharedService,
              private adminService: ApiService, private router: Router, private formBuilder: FormBuilder) {
    this.phoneForm = new FormGroup({
      mobileNumber: new FormControl(undefined, [Validators.required]),
    });

    this.otpForm = this.formBuilder.group({
      mobileOtp: new FormControl({disabled: false}, [Validators.required]),
    });
  }
  otpSubmitted = false;
  startCountDown() {
    this.counter = 300;
  }

  loginNumber() {
    this.sharedService.showSpinner.next(true);
    // Logic to remove the country code
    const onlyMobileNumber = this.phoneForm.get('mobileNumber')!.value.replace(/\D/g, '').slice(-10)
    const data = {
      mobileNo: onlyMobileNumber,
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
    this.selectedOtp = null;
    this.phoneNumberSubmitted = true;
    this.showLogo = false;
    this.showBackButton = true;
    this.startCountDown();
    this.userId = res.data.user.id;
    this.otpSubmitted = false;
    this.sharedService.showSpinner.next(false);
    this.phoneForm.reset();
  }

  ionViewWillEnter() {
    this.selectedOtp = null;
    this.otpSubmitted = false;
    this.phoneNumberSubmitted = false;
    this.phoneForm.get('mobileNumber')!.setValue('');
    // this.phoneForm.get('isWhatsAppAvailable')!.setValue(false);
    this.sharedService.onSettingEvent.next(true);
    this.sharedService.onUpdateCart();
    this.storageService.removeStoredItem(appConstants.SELECTED_SERVICES);
  }

  ngOnInit() {
    this.selectedOtp = null;
    this.sharedService.onSettingEvent.next(true);
    this.countDown = timer(0, this.tick).subscribe(() => --this.counter);

  }

  onOtpInput(event: any) {
    this.selectedOtp = event;
  }

  onBackButton() {
    if (!this.otpSubmitted && this.phoneNumberSubmitted) {
      this.phoneNumberSubmitted = false;
      this.showLogo = true;
      this.showBackButton = false;
    }

    if (this.otpSubmitted && this.phoneNumberSubmitted) {
      this.phoneNumberSubmitted = true;
      this.showLogo = false;
      this.showBackButton = true;
      this.startCountDown();
    }
  }

  onSubmitOtp() {
    if (!this.selectedOtp) {
      this.sharedService.presentToast('Please Enter Valid OTP', 'error').then();
      return;
    }
    this.verifyOtp();
  }

  verifyOtp() {
    this.sharedService.showSpinner.next(true);
    const data = {
      userId: this.userId,
      otp: this.selectedOtp
    };
    this.adminService.verifyOtp(data).subscribe(
        res => this.verifyOtpSuccess(res),
        error => {
          this.adminService.commonError(error);
          this.sharedService.showSpinner.next(false);
          this.ngOtpInputRef.setValue('');
        }
    );
  }

  verifyOtpSuccess(res: any) {
    this.selectedOtp = null;
    this.sharedService.presentToast(res.message, 'success').then();
    this.sharedService.showSpinner.next(false);
    this.otpSubmitted = true;
    this.showLogo = true;
    const userData = res.data.user;
    if (!userData.isRegistered) {
      this.router.navigate(['sign-up']);
      return;
    }
    this.router.navigate(['/feed']);

    // if (userData.isRegistered && userData.roleId.name === 'admin') {
    //   this.router.navigate(['/admin-panel']);
    // } else if (userData.isRegistered && userData.roleId.name === 'customer') {
    //   this.router.navigate(['/feed']);
    // }
  }


  async reasonAlert() {
    const alert = await this.alertController.create({
      header: 'Do you want to resend the OTP?',
      cssClass: 'alert-popup',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.ngOtpInputRef.setValue('');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.resendOtp();
          },
        },
      ]
    });

    await alert.present();
  }

  resendOtp() {
    this.adminService.resendOtp(this.userId).subscribe(
        res => {
          this.startCountDown();
          this.ngOtpInputRef.setValue('');
          this.sharedService.presentToast('OTP Resent successfully.', 'success');
        },
        error => {
          this.adminService.commonError(error);
          this.sharedService.showSpinner.next(false);
        }
    );
  }

  async showPolicy() {
    if (this.phoneForm.invalid) {
      this.sharedService.presentToast('Please Enter Valid Phone Number', 'error').then();
      return;
    }
    const modal = await this.modalController.create({
      component: UserAgreementPolicyPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned!.data === 'approved') {
        this.loginNumber();
      }
    });
    return await modal.present();
  }
}
