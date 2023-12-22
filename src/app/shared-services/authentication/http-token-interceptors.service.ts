import { Injectable } from '@angular/core';
import {Observable, throwError, BehaviorSubject, of} from 'rxjs';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {
  catchError,
  finalize,
  switchMap,
  filter,
  take,
} from 'rxjs/operators';
import {ToastController} from '@ionic/angular';
import {StorageService} from '../storage.service';
import {Router} from '@angular/router';
import {appConstants} from '../../../assets/constants/app-constants';
import {SharedService} from "../shared.service";
import {ApiService} from "../api.service";

@Injectable({
  providedIn: 'root'
})
export class HttpTokenInterceptorsService {
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  isRefreshingToken = false;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private storageService: StorageService, private sharedService: SharedService, private toastCtrl: ToastController, private apiService: ApiService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if we need additional token logic or not
    if (this.isInBlockedList(request.url)) {
      return next.handle(request);
    } else {
      return next.handle(this.addToken(request)).pipe(
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              switch (err.status) {
                case 400:
                  return this.handle400Errors(err);
                case 401:
                  return this.handle401Error(request, next);
                default:
                  return throwError(err);
              }
            } else {
              return throwError(err);
            }
          })
      );
    }
  }

  // Filter out URLs where you don't want to add the token!
  private isInBlockedList(url: string): any {
    // Example: Filter out our login and logout API call
    return (url === `${appConstants.baseAuthUrl}loginWithOtp` ||
        url === `${appConstants.baseAuthUrl}verifyOtp` ||
        url === `${appConstants.baseAuthUrl}logout`);
  }

  // Add our current access token from the service if present
  private addToken(req: HttpRequest<any>) {
    if (this.apiService.currentAccessToken) {
      return req.clone({
        headers: new HttpHeaders({
          "ngrok-skip-browser-warning": "69420",
          Authorization: `Bearer ${this.apiService.currentAccessToken}`
        })
      });
    } else {
      return req;
    }
  }

  // We are not just authorized, we couldn't refresh token
// or something else along the caching went wrong!
  private async handle400Errors(err) {
    // Potentially check the exact error reason for the 400
    // then log out the user automatically
    switch (err.status) {
      case 400:
        this.sharedService.presentToast('Logged out due to authentication mismatch', 'error');
        this.apiService.logout();
        break;
      case 404:
        this.apiService.isAuthenticated.next(false);
        this.storageService.removeStoredItem(appConstants.REFRESH_TOKEN_KEY);
        this.storageService.removeStoredItem(appConstants.ACCESS_TOKEN_KEY);
        this.storageService.removeStoredItem(appConstants.USER_INFO);
        this.router.navigate(['/login']);
        break;
    }
    return of(null);
  }

// Indicates our access token is invalid, try to load a new one
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Check if another call is already using the refresh logic
    if (!this.isRefreshingToken) {

      // Set to null so other requests will wait
      // until we got a new token!
      this.tokenSubject.next(null);
      this.isRefreshingToken = true;
      this.apiService.currentAccessToken = null;

      // First, get a new access token
      return this.apiService.getNewAccessToken().pipe(
          switchMap((token: any) => {
            if (token) {
              // Store the new token
              const accessToken = token.access.token;
              return this.apiService.storeAccessToken(accessToken).pipe(
                  switchMap((_: any): any => {
                    // Use the subject so other calls can continue with the new token
                    this.tokenSubject.next(accessToken);
                    // Perform the initial request again with the new token
                    return next.handle(this.addToken(request));
                  })
              );
            } else {
              // No new token or other problem occurred
              return of(null);
            }
          }),
          finalize(() => {
            // Unblock the token reload logic when everything is done
            this.isRefreshingToken = false;
          })
      );
    } else {
      // "Queue" other calls while we load a new token
      return this.tokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap((token: any): any => {
            // Perform the request again now that we got a new token!
            return next.handle(this.addToken(request));
          })
      );
    }
  }
}
