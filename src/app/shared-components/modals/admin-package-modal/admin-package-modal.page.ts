import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalController, IonicModule, NavParams} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {ApiService} from "../../../shared-services/api.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {SharedService} from "../../../shared-services/shared.service";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {CustomSelectPage} from "../../components/custom-select/custom-select.page";

@Component({
  selector: 'app-admin-package-modal',
  templateUrl: './admin-package-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDividerModule]
})
export class AdminPackageModalPage implements OnInit {

  constructor(private navParams: NavParams, private router: Router,
              private adminService: ApiService, private communication: CommunicationService,
              private sharedService: SharedService, private formBuilder: FormBuilder,
              private modalController: ModalController) {
  }

  selectedImage: any = null;
  imageBase64: any = '';
  imageUrl: any = '';
  packageId: any = '';
  editMode: any = false;
  subServices: any = [];
  services: any = [];
  filteredSubServices: any = [];
  serviceTypes: any = [];
  brandsList: any = [];
  selectedServices: any = [];
  totalAmount: any = 0;
  discountAmount: any;
  packageForm: FormGroup;

  ngOnInit() {
    this.packageForm = this.formBuilder.group({
      name: new FormControl({value: '', disabled: false}, [
        Validators.required
      ]),
      discount: new FormControl({value: '', disabled: false}, [
      ]),
      description: new FormControl({value: '', disabled: false}, [
      ]),
    });
  }

  ionViewWillLeave() {
    this.editMode = false;
  }

  ionViewWillEnter() {
    this.getServicesData();
  }

  patchPackageData() {
    this.editMode = false;
    if (this.navParams && this.navParams.data && this.navParams.data['id']) {
      this.editMode = true;
      this.patchModalData(this.navParams.data);
    }
  }

  patchModalData(patchData) {
    this.packageId = patchData.id;
    this.packageForm.get('name').setValue(patchData.name);
    this.packageForm.get('discount').setValue(patchData.discount);
    this.packageForm.get('description').setValue(patchData.description);
    this.selectedServices = patchData.services;
    this.imageUrl = `${patchData.imageUrl}?${new Date().getTime()}`;
  }

  onAddService() {
    if (this.packageForm.invalid || this.selectedServices.length === 0) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    if (this.editMode) {
      this.patchPackage();
    } else {
      this.createPackage();
    }
  }

  patchPackage() {
    const formData = this.createFormData();
    this.adminService.updatePackage(formData, this.packageId).subscribe(
        res => this.createPackageSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createFormData() {
    const formData = new FormData();
    const serviceIds = this.selectedServices.map(v => v.id);
    formData.append('services', JSON.stringify(serviceIds));
    formData.append('name', this.packageForm.get('name').value);
    formData.append('discount', this.packageForm.get('discount').value);
    formData.append('description', this.packageForm.get('description').value);
    if (this.imageBase64) {
      const fileName = `package-${(this.packageForm.get('name').value).toLowerCase().trim().split(' ').join('-')}.${this.selectedImage.name.split('.')[1]}`;
      formData.append('file', this.selectedImage, fileName);
    }
    return formData;
  }

  createPackage() {
    const formData = this.createFormData();
    this.adminService.createPackage(formData).subscribe(
        res => this.createPackageSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createPackageSuccess(res) {
    this.closeModal();
  }

  closeModal() {
    this.packageForm.reset();
    this.selectedImage = null;
    this.imageBase64 = '';
    const onClosedData: string = 'Wrapped Up!';
    setTimeout(() => {
      this.modalController.dismiss(onClosedData);
    }, 100);
  }

  async presentModal() {
    const componentData = {
      title: 'Select Services',
      itemTextField: 'name',
      multiple: true,
      services: this.services.map((val) => {
        val.selected = !!this.selectedServices.map(v => v.id).includes(val.id);
        return val;
      }),
    };
    const modal = await this.modalController.create({
      component: CustomSelectPage,
      cssClass: 'admin-modal-class',
      backdropDismiss: true,
      showBackdrop: true,
      breakpoints: [0, 0.8, 1],
      initialBreakpoint: 0.8,
      componentProps: componentData
    });
    modal.onWillDismiss().then((data: any) => {
      this.selectedServices = data.data ? data.data : [];
      this.totalAmount = this.selectedServices.map(v => v.price).reduce((partialSum, a) => partialSum + a, 0);
    });
    return await modal.present();
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
    const allServices$ = this.adminService.getAllServices();
    forkJoin([allServiceTypes$, allSubServices$, allServices$]).subscribe(
        results => {
          this.getServicesDataSuccess(results[0], results[1], results[2]);
          setTimeout(() => {
            this.patchPackageData();
          }, 500);
        },
        error => {
          this.adminService.commonError(error);
        });
  }

  getServicesDataSuccess(serviceTypes, subServices, services) {
    this.serviceTypes = serviceTypes;
    this.subServices = subServices;
    this.services = services;
  }


}
