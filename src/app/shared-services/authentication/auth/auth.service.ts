import {Injectable} from '@angular/core';
import {ApiService} from "../../api.service";
import {filter, map, pairwise, take} from "rxjs/operators";
import {Router, RoutesRecognized} from "@angular/router";
import {StorageService} from "../../storage.service";
import {SharedService} from "../../shared.service";
import {appConstants} from "../../../../assets/constants/app-constants";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private sharedService: SharedService,
                private storageService: StorageService,
                private apiService: ApiService,
                private router: Router) {
    }

    async isUserLoggedIn() {
        return this.apiService.isAuthenticated.pipe(
            filter(val => val !== null), // Filter out initial Behaviour subject value
            take(1),
        ).subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                return true;
            } else {
                this.router.navigate(['/']);
                return false;
            }
        });

    }

    async userBeforeLoggedIn() {
        return this.apiService.isAuthenticated.pipe(
            filter(val => val !== null), // Filter out initial Behaviour subject value
            take(1),
        ).subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                this.router.navigate(['/']);
                return false;
            } else {
                return true;
            }
        });
    }

    async isUserAdmin() {
        return this.apiService.isAuthenticated.pipe(
            filter(val => val !== null), // Filter out initial Behaviour subject value
            take(1),
        ).subscribe((isAuthenticated) => {
            const userData = this.storageService.getStorageValue(appConstants.USER_INFO);
            if (isAuthenticated && userData.roleId.name === 'admin') {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        });
    }

    async isAppointmentScheduled() {
        if (this.sharedService.isBookingCartEmpty()) {
            await this.router.navigate(['/feed']);
            return false;
        } else {
            return true;
        }
    }

    async successPageGuard() {
        let previousRoute = '';
        this.router.events
            .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
            .subscribe((events: RoutesRecognized[]) => {
                previousRoute = events[0].urlAfterRedirects;
            });
        if (previousRoute === 'schedule-appointment') {
            return true;
        } else {
            await this.router.navigate(['/feed']);
            return false;
        }
    }
}
