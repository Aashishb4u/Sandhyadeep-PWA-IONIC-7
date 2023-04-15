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
              private adminService: ApiService, private communication: CommunicationService,
              private sharedService: SharedService, private formBuilder: FormBuilder, private modalController: ModalController) { }
  selectedImage: any = null;
  imageBase64: any = '';
  imageUrl: any = '';
  serviceId: any = '';
  editMode: any = false;
  subServices: any = [];
  filteredSubServices: any = [];
  serviceTypes: any = [];
  brandsList: any = [];
  skinTypesList: any = [];
  servicesForm: FormGroup;
  ngOnInit() {
    this.servicesForm = this.formBuilder.group({
      name: ['', Validators.required],
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
        this.servicesForm.get('skinTypes').setValue('all');
      }
    }
  }

  onChangingBrand(event) {
    if (event && event.target && event.target.value) {
      const selectedValues = event.target.value.map(v => v.toLowerCase());
      if (selectedValues.includes('no_brands')) {
        this.servicesForm.get('brands').setValue('no_brands');
      }
    }
  }

  patchModalData(patchData) {
    this.serviceId = patchData.id;
    this.servicesForm.get('name').setValue(patchData.name);
    this.servicesForm.get('type').setValue(patchData.type);
    this.servicesForm.get('duration').setValue(patchData.duration);
    this.servicesForm.get('price').setValue(patchData.price);
    if (patchData.subService && patchData.subService.id) {
      this.servicesForm.get('subService').setValue(patchData.subService.id);
    }
    if (patchData.serviceType && patchData.serviceType.id) {
      this.servicesForm.get('serviceType').setValue(patchData.serviceType.id);
    }
    this.servicesForm.get('description').setValue(patchData.description);
    this.servicesForm.get('brands').setValue(patchData.brands);
    this.servicesForm.get('skinTypes').setValue(patchData.skinTypes);
    // This logic to update the image
    this.imageUrl = `${patchData.imageUrl}?${new Date().getTime()}`;
  }

  onAddService() {
    if (this.servicesForm.invalid) {
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
    formData.append('name', this.servicesForm.get('name').value);
    formData.append('type', this.servicesForm.get('type').value);
    formData.append('duration', this.servicesForm.get('duration').value);
    formData.append('price', this.servicesForm.get('price').value);
    formData.append('subService', this.servicesForm.get('subService').value);
    formData.append('serviceType', this.servicesForm.get('serviceType').value);
    formData.append('description', this.servicesForm.get('description').value);
    formData.append('brands', this.servicesForm.get('brands').value);
    formData.append('skinTypes', this.servicesForm.get('skinTypes').value);
    if (this.imageBase64) {
      const fileName = `service-${(this.servicesForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
      formData.append('file', this.selectedImage, fileName);
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
    if (this.selectedImage) {
      const fileName = `service-${(this.servicesForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
      formData.append('file', this.selectedImage, fileName);
    }
    formData.append('name', this.servicesForm.get('name').value);
    formData.append('type', this.servicesForm.get('type').value);
    formData.append('duration', this.servicesForm.get('duration').value);
    formData.append('price', this.servicesForm.get('price').value);
    formData.append('subService', this.servicesForm.get('subService').value);
    formData.append('serviceType', this.servicesForm.get('serviceType').value);
    formData.append('description', this.servicesForm.get('description').value);
    formData.append('brands', this.servicesForm.get('brands').value);
    formData.append('skinTypes', this.servicesForm.get('skinTypes').value);
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
    this.servicesForm.reset();
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
