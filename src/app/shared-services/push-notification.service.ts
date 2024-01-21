import {Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {HttpClient} from '@angular/common/http';
import {appConstants} from "../../assets/constants/app-constants";
import {StorageService} from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {

    private readonly VAPID_PUBLIC_KEY = appConstants.push_public_key; // Replace with your actual server public key
    private readonly SUBSCRIPTION_API: string = `${appConstants.baseURLAdminAPIs}subscriptions/save`;
    private readonly NOTIFICATION_API: string = `${appConstants.baseURLAdminAPIs}notifications/send`;

    constructor(private storageService: StorageService, private swPush: SwPush, private httpClient: HttpClient) {
    }

    async subscribeToNotifications() {
        // const subscription = await this.storageService.getStoredValue('subscription');
        const permission = await this.checkNotificationPermission();
        if(!permission) return;

        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
            .then((sub) => {
                console.log('Check 123');
                this.sendSubscriptionToServer(sub)
            })
            .catch((err) => {
                console.log('Got error');
                console.error('Could not subscribe to push notifications', err)
            });
    }

    async checkNotificationPermission(): Promise<boolean> {
        const permissionStatus = await Notification.requestPermission();

        return permissionStatus === 'granted';
    }

    private sendSubscriptionToServer(subscription: PushSubscription): void {
        this.httpClient.post(`${this.SUBSCRIPTION_API}`, {subscription})
            .subscribe(
                (response) => {
                    // this.storageService.storeValue('subscription', response);
                },
                (error) => console.error('Error sending subscription to server', error)
            );
    }

    sendPushNotification(data) {
        return this.httpClient.post(`${this.NOTIFICATION_API}`, data);
    }
}
