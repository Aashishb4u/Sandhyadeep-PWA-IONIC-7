import {Injectable} from '@angular/core';
import {appConstants} from "../../assets/constants/app-constants";
import {SharedService} from "./shared.service";
import {ApiService} from "./api.service";
import {forkJoin, takeUntil} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FetchDataService {

    constructor(public sharedService: SharedService,
                public adminService: ApiService) {
        const isAuthenticated: boolean = this.adminService.isAuthenticated.value;
        if (isAuthenticated) this.getServiceTypes();
    }

    getServiceTypes() {
        this.adminService.getAllServiceTypes()
            .pipe(
                takeUntil(this.sharedService.cancelRequest$),
            ).subscribe(
            res => this.getAllServiceTypesSuccess(res),
            error => {
                this.adminService.commonError(error);
            }
        );
    }

    getAllServiceTypesSuccess(res) {
        let serviceTypes: any = res;
        serviceTypes = serviceTypes.map((ser) => {
            ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
            return ser;
        });
        this.sharedService.serviceTypesSubject.next(serviceTypes);
        const subServices$ = this.adminService.getAllSubService();
        const services$ = this.adminService.getAllServices();
        const packages$ = this.adminService.getAllPackages();
        forkJoin([subServices$, services$, packages$])
            .pipe(takeUntil(this.sharedService.cancelRequest$))
            .subscribe(results => {
                this.sharedService.subServicesSubject.next(results[0]);
                this.sharedService.servicesSubject.next(results[1]);
                this.getAllPackagesSuccess(results[2]);
                this.sharedService.fetchDataComplete.next(true);
            });
    }

    getAllPackagesSuccess(res) {
        const packageList = res && res.length > 0 ? res.map((pack) => {
            pack.imageUrl = this.sharedService.getUniqueUrl(pack.imageUrl);
            pack.totalAmount = pack.services.map(v => +v.price).reduce((a, b) => a + b);
            pack.finalAmount = +pack.totalAmount - +pack.discount;
            pack.totalDuration = pack.services.map(v => +v.duration).reduce((a, b) => a + b);
            pack.counter = 1;
            pack.showIncludes = false;
            if (pack.services && pack.services.length > 0) {
                pack.services = pack.services.map((ser) => {
                    ser.imageUrl = `${appConstants.domainUrlApi}${ser.imageUrl}?${new Date().getTime()}`;
                    return ser;
                });
            }
            return pack;
        }) : [];
        this.sharedService.packagesSubject.next(packageList);
    }

}
