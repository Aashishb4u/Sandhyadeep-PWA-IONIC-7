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
        forkJoin([subServices$, services$])
            .pipe(takeUntil(this.sharedService.cancelRequest$))
            .subscribe(results => {
                this.sharedService.subServicesSubject.next(results[0]);
                this.sharedService.servicesSubject.next(results[1]);
                this.sharedService.fetchDataComplete.next(true);
            });
    }
}
