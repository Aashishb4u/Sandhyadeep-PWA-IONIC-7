import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {SharedService} from "../../../shared-services/shared.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {ApiService} from "../../../shared-services/api.service";

@Component({
  selector: 'app-admin-service-type-modal',
  templateUrl: './admin-service-type-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule,
    ReactiveFormsModule,]
})
export class AdminServiceTypeModalPage implements OnInit {

  constructor(private navParams: NavParams, private router: Router, private adminService: ApiService,
              private communication: CommunicationService, private sharedService: SharedService, private formBuilder: FormBuilder, private modalController: ModalController) { }
  selectedImage: any = null;
  imageBase64: any = '';
  imageUrl: any = '';
  serviceTypeId: any = '';
  editMode: any = false;
  serviceTypesForm: FormGroup;
  ngOnInit() {
    this.serviceTypesForm = this.formBuilder.group({
      image : new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      name: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      type: new FormControl({value: '', disabled: false}, [
        Validators.required
      ])
    });
    this.editMode = false;
    if (this.navParams && this.navParams.data && this.navParams.data['id']) {
      this.editMode = true;
      this.patchModalData(this.navParams.data);
    }
  }

  ionViewWillLeave() {
    this.editMode = false;
  }

  patchModalData(patchData) {
    this.serviceTypesForm.get('name').setValue(patchData.name);
    this.serviceTypesForm.get('type').setValue(patchData.type);
    this.serviceTypesForm.get('image').setValue(patchData.imageUrl);
    // This logic to update the image
    this.imageUrl = `${patchData.imageUrl}?${new Date().getTime()}`;
    this.serviceTypeId = patchData.id;
  }

  onAddServiceType() {
    if (this.serviceTypesForm.invalid) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    if ((this.imageUrl.length === 0) && (this.imageBase64.length === 0)) {
      this.sharedService.presentToast('Please select the image', 'error');
      return;
    }
    if (this.editMode) {
      this.patchServiceType();
    } else {
      this.createServiceType();
    }
  }

  patchServiceType() {
    const formData = new FormData();
    formData.append('name', this.serviceTypesForm.get('name').value);
    formData.append('type', this.serviceTypesForm.get('type').value);
    if (this.imageBase64) {
      const fileName = `service-type-${(this.serviceTypesForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
      formData.append('file', this.selectedImage, fileName);
    }
    this.adminService.updateServiceType(formData, this.serviceTypeId).subscribe(
        res => this.createServiceTypeSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createServiceType() {
    const formData = new FormData();
    const fileName = `service-type-${(this.serviceTypesForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
    formData.append('name', this.serviceTypesForm.get('name').value);
    formData.append('type', this.serviceTypesForm.get('type').value);
    formData.append('file', this.selectedImage, fileName);
    this.adminService.createServiceType(formData).subscribe(
        res => this.createServiceTypeSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createServiceTypeSuccess(res) {
    this.closeModal();
    this.sharedService.presentToast(res.message, 'success');
  }

  closeModal() {
    this.serviceTypesForm.reset();
    this.selectedImage = null;
    this.imageBase64 = '';
    const onClosedData: string = "Wrapped Up!";
    setTimeout(() => {
      this.modalController.dismiss(onClosedData);
    }, 100);
  }

  onFileChange(event) {
    const image = event.target.files[0];
    const fileExtension = image.name.split('.')[1].toLowerCase();
    // if (image && image.type.includes('image') && ['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    this.getImageBase64(image);
    this.selectedImage = image;
    this.imageUrl = '';
    // } else {
    //   this.sharedService.presentToast('Image format is incorrect', 'error');
    // }
  }

  getImageBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageBase64 = reader.result;
    };
  }

}
