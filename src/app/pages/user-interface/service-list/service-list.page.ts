import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, combineLatest, forkJoin, lastValueFrom} from 'rxjs';
import {appConstants} from "../../../../assets/constants/app-constants";
import {StorageService} from "../../../shared-services/storage.service";
import {SharedService} from "../../../shared-services/shared.service";
import {ApiService} from "../../../shared-services/api.service";
import {MatListModule} from "@angular/material/list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {SkeletonLoaderPage} from "../../../shared-components/components/skeleton-loader/skeleton-loader.page";
import {FetchDataService} from "../../../shared-services/fetch-data.service";

@Component({
    selector: 'service-list',
    templateUrl: './service-list.page.html',
    styleUrls: ['./service-list.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule,
        MatExpansionModule,
        MatListModule,
        SkeletonLoaderPage,
        MatCheckboxModule]
})
export class ServiceListPage implements OnInit, OnDestroy, AfterViewInit {
    @Output() updateAmount = new EventEmitter<object>();
    @Input() isRefreshed;
    @Input() refreshRate;
    @Input() hideCheckBox = false;

    constructor(private storageService: StorageService, public sharedService: SharedService,
                public fetchData: FetchDataService, private router: Router, private adminService: ApiService) {
      this.sharedService.fetchDataComplete = new BehaviorSubject<any>(false);
    }

    show = '';
    show1 = false;
    mainServices: any = [];
    services: any = [];
    subServices: any = [];
    amountPurchased = 0;
    selectedServices = [];
    apiCalled = 0;


    ngOnInit() {
        this.sharedService.showServicesSkeletonSpinner.next(true);
    }

    ngAfterViewInit() {
       setTimeout(() => {
           combineLatest([
               this.sharedService.serviceTypesSubject,
               this.sharedService.subServicesSubject,
               this.sharedService.servicesSubject
           ]).subscribe(([serviceTypes, subServices, services]) => {
               if (serviceTypes && serviceTypes.length && subServices && subServices.length && services && services.length) {
                   // All three observables have emitted non-empty arrays
                   this.mainServices = serviceTypes;
                   this.subServices = subServices;
                   this.services = services;
                   this.getAllDataAtOnce();
               }
           });
       }, 1000);
    }

    ngOnDestroy() {
        this.sharedService.fetchDataComplete.unsubscribe();
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     for (const propName in changes) {
    //         if (changes.hasOwnProperty(propName)) {
    //             switch (propName) {
    //                 case 'refreshRate': {
    //                     setTimeout(() => {
    //                         console.log("called changes");
    //                         this.getAllDataAtOnce();
    //                     }, 500);
    //                 }
    //             }
    //         }
    //     }
    // }

    // ionViewWillEnter() {
    //     this.sharedService.showServicesSkeletonSpinner.next(true);
    //     console.log("called enter");
    //     this.getAllDataAtOnce();
    // }

    getAllDataAtOnce() {
        if (this.mainServices.length > 0 && this.subServices.length > 0 && this.services.length > 0) {
            this.apiCalled = this.apiCalled + 1;
            const selectedServices = this.storageService.getStorageValue(appConstants.SELECTED_SERVICES);
            const selectedServiceIds = selectedServices && selectedServices.length ?
                selectedServices.map(v => v.id) : [];
            this.mainServices = this.mainServices.map((main) => {
                main.subServices = this.subServices.filter(v => v.serviceType.id === main.id)
                    .map((sub) => {
                        sub.services = this.services
                            .filter(ser => ser.subService && ser.subService.id === sub.id)
                            .map((service) => {
                                service.isChecked = !!selectedServiceIds.includes(service.id);
                                return service;
                            });
                        return sub;
                    });
                main.services = this.services
                    .filter(ser => ser.serviceType.id === main.id)
                    .filter(v => !v.subService)
                    .map((service) => {
                        service.loaded = false;
                        service.isChecked = !!selectedServiceIds.includes(service.id);
                        return service;
                    });
                main.show = false;
                return main;
            });
            this.amountPurchased = this.calculateTotalAmount();
            this.sharedService.updateServiceTotal.next(this.amountPurchased);
        }
        setTimeout(() => {
            this.sharedService.showServicesSkeletonSpinner.next(false);
        }, 500)
    }

    calculateTotalAmount() {
        return this.mainServices.reduce((acc, first) => {
            const onlyServicePrice = first.services.reduce((acc2, second) => {
                if (second.isChecked) {
                    acc2 = acc2 + parseInt(second.price, 10);
                }
                return acc2;
            }, 0);
            const subServiceServicesPrice = first.subServices.reduce((acc2, subServ) => {
                if (subServ && subServ.services && subServ.services.length > 0) {
                    subServ.services.filter(v => v.isChecked).forEach((val) => {
                        acc2 = acc2 + parseInt(val.price, 10);
                    });
                }
                return acc2;
            }, 0);
            acc = parseInt(acc, 10) + parseInt(onlyServicePrice, 10) + parseInt(subServiceServicesPrice, 10);
            return acc;
        }, 0);
    }

    onSelectServices(service) {
        service.isChecked = !service.isChecked;
        this.amountPurchased = this.calculateTotalAmount();

        this.selectedServices = this.mainServices.reduce((acc, first) => {
            let selectedServices = [];
            selectedServices = first.services.filter(v => v.isChecked);
            if (selectedServices.length > 0) {
                acc.push(selectedServices);
            }
            if (first.subServices && first.subServices.length > 0) {
                selectedServices = [];
                selectedServices = first.subServices.reduce((acc2, subServ) => {
                    if (subServ && subServ.services && subServ.services.length > 0) {
                        acc2 = acc2.concat(subServ.services.filter(v => v.isChecked));
                    }
                    return acc2;
                }, []);
                acc = acc.concat(selectedServices);
            }
            return acc;
        }, []);
        this.sharedService.updateServiceTotal.next(this.amountPurchased);
        const data = {
            amountPurchased: this.amountPurchased,
            selectedServices: [].concat.apply([], this.selectedServices)
        };
        this.updateAmount.emit(data);
    }
}
