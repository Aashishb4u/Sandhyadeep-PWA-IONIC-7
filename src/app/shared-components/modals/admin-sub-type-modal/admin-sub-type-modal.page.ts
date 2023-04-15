import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ModalController, NavParams} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from "@angular/material/button";
import {SharedService} from "../../../shared-services/shared.service";
import {CommunicationService} from "../../../shared-services/admin-services/communication.service";
import {ApiService} from "../../../shared-services/api.service";
@Component({
  selector: 'app-admin-sub-type-modal',
  templateUrl: './admin-sub-type-modal.page.html',
  styleUrls: ['../admin-modal/admin-modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatButtonModule, ReactiveFormsModule]
})
export class AdminSubTypeModalPage implements OnInit {

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
  subServiceId: any = '';
  editMode: any = false;
  serviceTypes: any = [];
  adminComponentForm: FormGroup;

  ngOnInit() {
    this.adminComponentForm = this.formBuilder.group({
      name: ['', Validators.required],
      serviceType: ['', Validators.required]
    });
    this.getMainServices();
    this.editMode = false;
    if (this.navParams && this.navParams.data && this.navParams.data['id']) {
      this.editMode = true;
      this.patchModalData(this.navParams.data);
    }
  }


  getMainServices() {
    this.adminService.getAllServiceTypes().subscribe(
        res => this.getMainServicesSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  getMainServicesSuccess(res) {
    this.serviceTypes = res;
  }

  ionViewWillLeave() {
    this.editMode = false;
  }

  patchModalData(patchData) {
    const { name, serviceType, id } = patchData;
    this.adminComponentForm.patchValue({
      name,
      serviceType: serviceType.id,
    });
    this.subServiceId = id;
  }

  onAddValue() {
    if (this.adminComponentForm.invalid) {
      this.sharedService.presentToast('Please fill all the mandatory fields', 'error');
      return;
    }
    if (this.editMode) {
      this.patchSubService();
    } else {
      this.createSubService();
    }
  }

  patchSubService() {
    const data = {
      name: this.adminComponentForm.get('name').value,
      serviceType: this.adminComponentForm.get('serviceType').value
    };
    this.adminService.updateSubService(data, this.subServiceId).subscribe(
        res => this.createSubServiceSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createSubService() {
    const data = {
      name: this.adminComponentForm.get('name').value,
      serviceType: this.adminComponentForm.get('serviceType').value
    };
    this.adminService.createSubService(data).subscribe(
        res => this.createSubServiceSuccess(res),
        error => {
          this.adminService.commonError(error);
        }
    );
  }

  createSubServiceSuccess(res) {
    this.sharedService.presentToast(res.message, 'success');
    this.closeModal();
  }

  async closeModal() {
    this.adminComponentForm.reset();
    this.selectedImage = null;
    this.imageBase64 = '';
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  getImageBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageBase64 = reader.result;
    };
  }

}
