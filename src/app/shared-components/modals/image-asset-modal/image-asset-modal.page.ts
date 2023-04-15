import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {Router} from "@angular/router";
import {ApiService} from "../../../shared-services/api.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {SharedService} from "../../../shared-services/shared.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-image-asset-modal',
  templateUrl: './image-asset-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule]
})
export class ImageAssetModalPage implements OnInit {

  constructor(private navParams: NavParams,
              private router: Router,
              private adminService: ApiService,
              private communication: CommunicationService,
              private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private modalController: ModalController) {
  }

  selectedImage: any = null;
  imageBase64: any = '';
  imageUrl: any = '';
  appImageId: any = '';
  editMode: any = false;
  appImagesForm: FormGroup;
  assetLocations: any = ['Banner', 'PortFolio', 'parlour Images', 'Owner Images'];

  ngOnInit() {
    this.assetLocations = this.assetLocations.map((val) => {
      return {
        name: val,
        value: val.toLowerCase()
      };
    });
    this.appImagesForm = this.formBuilder.group({
      image: new FormControl({value: '', disabled: false}, [
      ]),
      name: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      assetLocation: new FormControl({value: '', disabled: false}, [
        Validators.required
      ])
    });
    this.editMode = false;
    if (this.navParams && this.navParams.data && this.navParams.data['id']) {
      this.editMode = true;
      setTimeout(() => {
        this.patchModalData(this.navParams.data);
      }, 700);
    }
  }

  ionViewWillLeave() {
    this.editMode = false;
  }

  patchModalData(patchData) {
    this.appImagesForm.get('name').setValue(patchData.name);
    this.appImagesForm.get('assetLocation').setValue(patchData.assetLocation);
    this.appImageId = patchData.id;
    // This logic to update the image
    this.imageUrl = `${patchData.imageUrl}?${new Date().getTime()}`;
  }

  onAddAppImage() {
    if (this.appImagesForm.invalid) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    if ((this.imageUrl.length === 0) && (this.imageBase64.length === 0)) {
      this.sharedService.presentToast('Please select the image', 'error');
      return;
    }
    if (this.editMode) {
      this.patchAppImage();
    } else {
      this.createAppImage();
    }
  }

  patchAppImage() {
    const formData = new FormData();
    formData.append('name', this.appImagesForm.get('name').value);
    formData.append('assetLocation', this.appImagesForm.get('assetLocation').value);
    if (this.imageBase64) {
      // tslint:disable-next-line:max-line-length
      const fileName = `service-type-${(this.appImagesForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
      formData.append('file', this.selectedImage, fileName);
    }
    this.adminService.updateAppImage(formData, this.appImageId).subscribe(
        res => this.createAppImageSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createAppImage() {
    const formData = new FormData();
    const fileName = `${(this.appImagesForm.get('assetLocation').value).toLowerCase().trim().split(' ').join('-')}-${(this.appImagesForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
    formData.append('name', this.appImagesForm.get('name').value);
    formData.append('assetLocation', this.appImagesForm.get('assetLocation').value);
    formData.append('file', this.selectedImage, fileName);
    this.adminService.createAppImage(formData).subscribe(
        res => this.createAppImageSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createAppImageSuccess(res) {
    this.closeModal();
    this.sharedService.presentToast(res.message, 'success');
  }

  async closeModal() {
    this.appImagesForm.reset();
    this.selectedImage = null;
    this.imageBase64 = '';
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
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
