import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ToastController} from '@ionic/angular';
import {appConstants} from '../../assets/constants/app-constants';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  onSettingEvent = new BehaviorSubject<boolean>(false);
  showSearchBox = new BehaviorSubject<boolean>(false);
  showBackIcon = new BehaviorSubject<boolean>(false);
  showSpinner = new BehaviorSubject<boolean>(false);
  selectedProduct = new BehaviorSubject<any>([]);
  showSkeletonSpinner = new BehaviorSubject<any>(false);
  updateCart = new BehaviorSubject<any>(0);
  onLoadToken = new BehaviorSubject<any>('');
  updateServiceTotal = new BehaviorSubject<any>(0);
  updatePackageTotal = new BehaviorSubject<any>(0);
  selectedServicesCount = new BehaviorSubject<any>(0);
  appLogoImage = '/assets/theme-images/Sandhyadeep_logo.png';
  profileIcon = 'assets/icon/profile-icon.png';

  constructor(public storageService: StorageService, public toastController: ToastController) { }


  onUpdateCart() {
    const selectedServices = this.storageService.getStorageValue(appConstants.SELECTED_SERVICES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_SERVICES) : [];
    const selectedPackages = this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) : [];
    this.updateCart.next(selectedServices.length + selectedPackages.length);
    return selectedServices.length + selectedPackages.length;
  }

  async presentToast(displayMessage: any, status: any) {
    const toast = await this.toastController.create({
      message: displayMessage,
      position: 'top',
      cssClass: `ionic-${status}-toast`,
      duration: 2000,
    });
    toast.present();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    const token = this.getToken();
    return !!(token && token.length > 0);
  }

  getApiKey() {
    let apiKey = 'fYsd4AW5pKz9_uV';
    return apiKey;
  }

  setToken(token: any) {
    localStorage.setItem('token', token);
  }

  removeAllUserDetails() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }

  setUserId(userId: any) {
    localStorage.setItem('userId', userId);
  }

  setUserName(userName: any) {
    localStorage.setItem('userName', userName);
  }

  getUserRole() {
    const userData = this.storageService.getStorageValue(appConstants.USER_INFO);
    return userData && userData.roleId ? userData.roleId.name : '';
  }

  getServicesInCart() {
    return this.storageService.getStorageValue(appConstants.SELECTED_SERVICES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_SERVICES) : [];
  }

  getPackagesInCart() {
    return this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) : [];
  }

  getUserId() {
    const userData = this.storageService.getStorageValue(appConstants.USER_INFO);
    return userData.id;
  }

  isBookingCartEmpty() {
    const packagesList = this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_PACKAGES) : [];
    const servicesList = this.storageService.getStorageValue(appConstants.SELECTED_SERVICES) ?
        this.storageService.getStorageValue(appConstants.SELECTED_SERVICES) : [];
    return !!(packagesList.length === 0 && servicesList.length === 0);
  }

  getFranchiseId() {
    return localStorage.getItem('franchiseId');
  }

}
