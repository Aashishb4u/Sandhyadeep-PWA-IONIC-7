import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {Router} from "@angular/router";
import {ApiService} from "../../../shared-services/api.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {SharedService} from "../../../shared-services/shared.service";
import {MatButtonModule} from "@angular/material/button";
import {ImageCompressionService} from "../../../shared-services/image-compression.service";
import {appConstants} from '../../../../assets/constants/app-constants'
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-image-asset-modal',
  templateUrl: './image-asset-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, MatButtonModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule]
})
export class ImageAssetModalPage implements OnInit {

  constructor(private navParams: NavParams,
              private router: Router,
              private adminService: ApiService,
              public imageCompression: ImageCompressionService,
              private communication: CommunicationService,
              private sharedService: SharedService,
              private formBuilder: FormBuilder,
              private modalController: ModalController) {
  }

  selectedImage: any = null;
  appImageId: any = '';
  editMode: any = false;
  componentForm: FormGroup;
  assetLocations: any = ['Banner', 'PortFolio', 'parlour Images', 'Owner Images'];
  appConstants = appConstants;

  ngOnInit() {
    this.assetLocations = this.assetLocations.map((val) => {
      return {
        name: val,
        value: val.toLowerCase()
      };
    });
    this.componentForm = this.formBuilder.group({
      image: new FormControl({value: '', disabled: false}, [
      ]),
      imageBase64: new FormControl({value: '', disabled: false}, [
      ]),
      imageUrl: new FormControl({value: '', disabled: false}, [
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

  get imageFileUrlControl() {
    return this.componentForm.get('imageUrl');
  }

  get imageFile() {
    return this.componentForm.get('image');
  }

  get imageBase64() {
    return this.componentForm.get('imageBase64');
  }

  patchModalData(patchData) {
    this.componentForm.get('name').setValue(patchData.name);
    this.componentForm.get('assetLocation').setValue(patchData.assetLocation);
    this.appImageId = patchData.id;
    const imageUrl = `${patchData.imageUrl}?${new Date().getTime()}`;
    this.componentForm.get('imageUrl').setValue(imageUrl);
  }

  onAddAppImage() {
    if (this.componentForm.invalid) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    const imageUrl = this.componentForm.get('imageUrl').value;
    const imageBase64 = this.componentForm.get('imageBase64').value;
    if ((imageUrl && imageUrl.length === 0) && (imageBase64 && imageBase64.length === 0)) {
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
    formData.append('name', this.componentForm.get('name').value);
    formData.append('assetLocation', this.componentForm.get('assetLocation').value);
    if (this.imageBase64.value) {
      // tslint:disable-next-line:max-line-length
      formData.append('file', this.componentForm.get('image').value);
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
    formData.append('name', this.componentForm.get('name').value);
    formData.append('assetLocation', this.componentForm.get('assetLocation').value);
    formData.append('file', this.componentForm.get('image').value);
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
    this.componentForm.reset();
    this.selectedImage = null;
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  onFileChange(event) {
    let reader = new FileReader();
    let image = event.target.files[0];
    const fileExtension = image.name.split('.')[1].toLowerCase();
    if (image && image.type.includes('image') && ['png', 'jpg', 'jpeg'].includes(fileExtension)) {
      if (event.target.files && event.target.files[0]) {
        const fileSizeInMB = image.size / (1024 * 1024);
        if (fileSizeInMB > 35) {
          this.sharedService.presentToast('File size should not exceed 35 MB', 'error');
          return;
        }
        this.sharedService.showSpinner.next(true);
        reader.readAsDataURL(image);
        reader.onload = (onLoadEvent) => {
          const fileName = `image-asset-${new Date().getTime()}.png`;
          const localUrl = onLoadEvent.target.result;
          this.imageCompression.compressFile(localUrl, fileName).then((compressedImage: any) => {
            this.sharedService.showSpinner.next(false);
            this.imageFileUrlControl.setValue('');
            this.componentForm.get('imageBase64').setValue(compressedImage.base64);
            this.componentForm.get('image').setValue(compressedImage.imageFile);
          });
        }
      }
    } else {
      this.sharedService.presentToast('Image format is incorrect', 'error');
    }
  }
}
