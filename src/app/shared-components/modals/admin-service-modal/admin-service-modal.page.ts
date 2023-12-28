import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatButtonModule} from "@angular/material/button";
import {ModalController, NavParams} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ApiService} from "../../../shared-services/api.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {SharedService} from "../../../shared-services/shared.service";
import {appConstants} from '../../../../assets/constants/app-constants'
import {ImageCompressionService} from "../../../shared-services/image-compression.service";

@Component({
  selector: 'app-admin-service-modal',
  templateUrl: './admin-service-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule,
    ReactiveFormsModule,]
})
export class AdminServiceModalPage implements OnInit {

  constructor(private navParams: NavParams, private router: Router,
              public imageCompression: ImageCompressionService,
              private adminService: ApiService, private communication: CommunicationService,
              private sharedService: SharedService, private formBuilder: FormBuilder, private modalController: ModalController) { }
  selectedImage: any = null;
  imageUrl: any = '';
  serviceId: any = '';
  editMode: any = false;
  subServices: any = [];
  filteredSubServices: any = [];
  serviceTypes: any = [];
  brandsList: any = [];
  skinTypesList: any = [];
  componentForm: FormGroup;
  appConstants = appConstants;

  ngOnInit() {
    this.componentForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: [''],
      imageBase64: [''],
      imageUrl: [''],
      type: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
      subService: '',
      serviceType: ['', Validators.required],
      description: '',
      brands: [],
      skinTypes: []
    });
  }

  ionViewWillLeave() {
    this.editMode = false;
  }

  ionViewWillEnter() {
    this.getServicesData();
    this.getBrands();
    this.getSkinTypes();
  }

  patchServiceData() {
    this.editMode = false;
    if (this.navParams && this.navParams.data && this.navParams.data['id']) {
      this.editMode = true;
      console.log(this.navParams.data);
      this.patchModalData(this.navParams.data);
    }
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

  getBrands() {
    this.sharedService.showSkeletonSpinner.next(true);
    this.adminService.getBrands().subscribe(
        res => this.getBrandsSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getBrandsSuccess(res) {
    this.brandsList = res;
    this.brandsList = this.brandsList.map((val) => {
      val.value = val.name.trim().split(' ').join('_');
      return val;
    });
    this.brandsList = this.brandsList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  }

  getSkinTypes() {
    this.sharedService.showSkeletonSpinner.next(true);
    this.adminService.getSkinTypes().subscribe(
        res => this.getSkinTypesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getSkinTypesSuccess(res) {
    this.skinTypesList = res;
    this.skinTypesList = this.skinTypesList.map((val) => {
      val.value = val.name.trim().split(' ').join('_');
      return val;
    });
    this.skinTypesList = this.skinTypesList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  }

  onChangingSkinType(event) {
    if (event && event.target && event.target.value) {
      const selectedValues = event.target.value.map(v => v.toLowerCase());
      if (selectedValues.includes('all')) {
        this.componentForm.get('skinTypes').setValue('all');
      }
    }
  }

  onChangingBrand(event) {
    if (event && event.target && event.target.value) {
      const selectedValues = event.target.value.map(v => v.toLowerCase());
      if (selectedValues.includes('no_brands')) {
        this.componentForm.get('brands').setValue('no_brands');
      }
    }
  }

  patchModalData(patchData) {
    this.serviceId = patchData.id;
    this.componentForm.get('name').setValue(patchData.name);
    this.componentForm.get('type').setValue(patchData.type);
    this.componentForm.get('duration').setValue(patchData.duration);
    this.componentForm.get('price').setValue(patchData.price);
    if (patchData.subService && patchData.subService.id) {
      this.componentForm.get('subService').setValue(patchData.subService.id);
    }
    if (patchData.serviceType && patchData.serviceType.id) {
      this.componentForm.get('serviceType').setValue(patchData.serviceType.id);
    }
    this.componentForm.get('description').setValue(patchData.description);
    this.componentForm.get('brands').setValue(patchData.brands);
    this.componentForm.get('skinTypes').setValue(patchData.skinTypes);
    // This logic to update the image
    const imageUrl = `${patchData.imageUrl}?${new Date().getTime()}`;
    this.componentForm.get('imageUrl').setValue(imageUrl);
  }

  onAddService() {
    if (this.componentForm.invalid) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    //
    // if ((this.imageUrl.length === 0) && (this.imageBase64.length === 0)) {
    //   this.sharedService.presentToast('Please select the image', 'error');
    //   return;
    // }
    if (this.editMode) {
      this.patchService();
    } else {
      this.createService();
    }
  }

  patchService() {
    const formData = new FormData();
    formData.append('name', this.componentForm.get('name').value);
    formData.append('type', this.componentForm.get('type').value);
    formData.append('duration', this.componentForm.get('duration').value);
    formData.append('price', this.componentForm.get('price').value);
    formData.append('subService', this.componentForm.get('subService').value);
    formData.append('serviceType', this.componentForm.get('serviceType').value);
    formData.append('description', this.componentForm.get('description').value);
    formData.append('brands', this.componentForm.get('brands').value);
    formData.append('skinTypes', this.componentForm.get('skinTypes').value);
    if (this.imageBase64.value) {
      formData.append('file', this.componentForm.get('image').value);
    }
    this.adminService.updateService(formData, this.serviceId).subscribe(
        res => this.createServiceSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createService() {
    const formData = new FormData();
    // if (this.selectedImage) {
    //   const fileName = `service-${(this.componentForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
    //   formData.append('file', this.selectedImage, fileName);
    // }
    formData.append('name', this.componentForm.get('name').value);
    formData.append('type', this.componentForm.get('type').value);
    formData.append('duration', this.componentForm.get('duration').value);
    formData.append('price', this.componentForm.get('price').value);
    formData.append('subService', this.componentForm.get('subService').value);
    formData.append('serviceType', this.componentForm.get('serviceType').value);
    formData.append('description', this.componentForm.get('description').value);
    formData.append('brands', this.componentForm.get('brands').value);
    formData.append('skinTypes', this.componentForm.get('skinTypes').value);
    formData.append('file', this.componentForm.get('image').value);
    this.adminService.createService(formData).subscribe(
        res => this.createServiceSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createServiceSuccess(res) {
    this.closeModal();
  }

  closeModal() {
    this.componentForm.reset();
    this.selectedImage = null;
    const onClosedData: string = "Wrapped Up!";
    setTimeout(() => {
      this.modalController.dismiss(onClosedData);
    }, 100);
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
          const fileName = `service-${new Date().getTime()}.png`;
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

  getServicesData() {
    const allSubServices$ = this.adminService.getAllSubService();
    const allServiceTypes$ = this.adminService.getAllServiceTypes();
    forkJoin([allServiceTypes$, allSubServices$]).subscribe(
        results => {
          this.getServicesDataSuccess(results[0], results[1]);
          setTimeout(() => {
            this.patchServiceData();
          }, 500);
        },
        error => {
          this.adminService.commonError(error);
        });
  }

  onChangeServiceType(event) {
    const selectValue = event.target.value;
    this.filteredSubServices = this.subServices.filter(v => v.serviceType.id === selectValue);
  }

  getServicesDataSuccess(serviceTypes, subServices) {
    this.serviceTypes = serviceTypes;
    this.subServices = subServices;
  }

}
