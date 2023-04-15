import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {StorageService} from "../../../shared-services/storage.service";
import {ApiService} from "../../../shared-services/api.service";
import {SharedService} from "../../../shared-services/shared.service";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import * as moment from 'moment';
import {appConstants} from "../../../../assets/constants/app-constants";

@Component({
  selector: 'app-admin-user-modal',
  templateUrl: './admin-user-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,  MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,]
})
export class AdminUserModalPage implements OnInit {
  userForm: FormGroup;
  editMode = false;
  imageBase64: any = '';
  imageUrl: any = '';
  userId: any = '';
  calculatedAge: any = '';
  selectedImage: any = null;
  roles: any = [];
  settingEditMode: any = false;
  constructor(private storageService: StorageService,
              private navParams: NavParams,
              private adminService: ApiService,
              private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private modalController: ModalController) { }

  onSubmit() {
    if (this.userForm.get('email').invalid) {
      this.sharedService.presentToast('Invalid Email Address', 'error');
      return;
    }
    if (this.userForm.invalid) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    if (this.editMode) {
      this.patchUser();
    } else {
      this.createUser();
    }
  }

  getAllRoles() {
    this.adminService.getAllRoles().subscribe(
        res => this.getAllRolesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getAllRolesSuccess(res) {
    this.roles = res;
  }


  patchUserData() {
    this.editMode = false;
    if (this.navParams && this.navParams.data && this.navParams.data['id']) {
      this.editMode = true;
      this.settingEditMode = this.navParams.data['settingEditMode'];
      setTimeout(() => {
        this.patchModalData(this.navParams.data);
      }, 700);
    }
  }

  patchModalData(patchData) {
    this.userId = patchData.id;
    const isDateValid = patchData.dateOfBirth ? moment(patchData.dateOfBirth).isValid() : false;
    this.userForm.get('name').setValue(patchData.name);
    this.userForm.get('mobileNo').setValue(patchData.mobileNo);
    this.userForm.get('isWhatsAppAvailable').setValue(patchData.isWhatsAppAvailable);
    this.userForm.get('roleId').setValue(patchData.roleId.id);
    this.userForm.get('isActive').setValue(patchData.isActive);
    this.userForm.get('email').setValue(patchData.email);
    this.imageUrl = `${patchData.imageUrl}?${new Date().getTime()}`;
    this.onChangeDOB();
  }

  calculateAge(dateString) {
    return moment().diff(moment(dateString), 'years')
  }

  onChangeDOB() {
    this.calculatedAge = this.calculateAge(this.userForm.get('dateOfBirth').value);
    console.log(this.calculatedAge);
  }

  patchUser() {
    const formData = this.createFormData();
    if (this.imageBase64) {
      const fileName = `user-${(this.userForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
      formData.append('file', this.selectedImage, fileName);
    }
    this.adminService.updateUser(formData, this.userId).subscribe(
        res => this.createUserSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createFormData() {
    const formData = new FormData();
    const { name, mobileNo, isWhatsAppAvailable,
      roleId, isActive, email, dateOfBirth } = this.userForm.value;
    formData.append('name', name);
    formData.append('mobileNo', mobileNo);
    formData.append('isWhatsAppAvailable', isWhatsAppAvailable);
    formData.append('roleId', roleId);
    formData.append('isActive', isActive);
    formData.append('email', email);
    formData.append('dateOfBirth', dateOfBirth);
    return formData;
  }

  createUser() {
    const formData = this.createFormData();
    if (this.selectedImage) {
      const fileName = `user-${(this.userForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
      formData.append('file', this.selectedImage, fileName);
    }
    this.adminService.createUser(formData).subscribe(
        res => this.createUserSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createUserSuccess(res) {
    const updatedUserId = res.data && res.data.userData && res.data.userData.id ?
        res.data.userData.id : null;
    const loggedInUser = this.storageService.getStorageValue(appConstants.USER_INFO);
    if (loggedInUser.id === updatedUserId) {
      this.storageService.storeValue(appConstants.USER_INFO, res.data.userData);
    }
    this.closeModal();
  }

  closeModal() {
    this.userForm.reset();
    this.selectedImage = null;
    this.imageBase64 = '';
    const onClosedData: string = "Wrapped Up!";
    setTimeout(() => {
      this.modalController.dismiss(onClosedData);
    }, 100);
  }

  updateUserSuccess(res) {
    this.closeModal();
  }

  ionViewWillLeave() {
    this.editMode = true;
  }

  ionViewWillEnter() {
    this.patchUserData();
    this.getAllRoles();
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      mobileNo: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      isWhatsAppAvailable: new FormControl({value: false, disabled: false}, [
      ]),
      roleId: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      isActive: new FormControl({value: true, disabled: false}, [
      ]),
      email: new FormControl({value: '', disabled: false}, [
        Validators.required, Validators.email
      ]),
      dateOfBirth: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
    });
    this.userForm.get('dateOfBirth')?.setValue(moment('01/01/2000').format());
    this.getAllRoles();
    this.onChangeDOB();
  }


  onFileChange(event) {
    const image = event.target.files[0];
    const fileExtension = image.name.split('.')[1].toLowerCase();
    if (image && image.type.includes('image') && ['png', 'jpg', 'jpeg'].includes(fileExtension)) {
      this.getImageBase64(image);
      this.selectedImage = image;
      this.imageUrl = '';
    } else {
      this.sharedService.presentToast('Image format is incorrect', 'error');
    }
  }

  getImageBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageBase64 = reader.result;
    };
  }
}
