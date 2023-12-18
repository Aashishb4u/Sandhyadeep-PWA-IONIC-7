import { Routes } from '@angular/router';
import {AuthService} from "./shared-services/authentication/auth/auth.service";
import {inject} from "@angular/core";
import {AdminInterfacePage} from "./pages/admin-interface/admin-interface.page";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // {
  //   path: '',
  //   canActivate: [async () => await inject(AuthService).userBeforeLoggedIn()],
  //   loadComponent: () => import('./pages/access-pages/slides/slides.page').then( m => m.SlidesPage)
  // },
  {
    path: 'slides',
    canActivate: [async () => await inject(AuthService).userBeforeLoggedIn()],
    loadComponent: () => import('./pages/access-pages/slides/slides.page').then( m => m.SlidesPage)
  },
  {
    path: 'login',
    canActivate: [async () => await inject(AuthService).userBeforeLoggedIn()],
    loadComponent: () => import('./pages/access-pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'sign-up',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/access-pages/sign-up/sign-up.page').then( m => m.SignUpPage)
  },
  {
    path: 'feed',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/feed/feed.page').then( m => m.FeedPage)
  },
  {
    path: 'services',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/services/services.page').then( m => m.ServicesPage)
  },
  {
    path: 'about-us',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/about-us/about-us.page').then( m => m.AboutUsPage)
  },
  {
    path: 'portfolio',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/portfolio/portfolio.page').then( m => m.PortfolioPage)
  },
  {
    path: 'settings',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'packages',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/packages/packages.page').then( m => m.PackagesPage)
  },
  {
    path: 'products',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/products/products.page').then( m => m.ProductsPage)
  },
  {
    path: 'bookings',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/bookings/bookings.page').then( m => m.BookingsPage)
  },
  {
    path: 'schedule-appointment',
      canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
      loadComponent: () => import('./pages/user-interface/schedule-appointment/schedule-appointment.page').then( m => m.ScheduleAppointmentPage)
  },
  {
    path: 'package-details',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/packages-details/packages-details.page').then( m => m.PackagesDetailsPage)
  },
  {
    path: 'product-details',
    canActivate: [async () => await inject(AuthService).isUserLoggedIn()],
    loadComponent: () => import('./pages/user-interface/product-details/product-details.page').then( m => m.ProductDetailsPage)
  },

  {
    path: 'admin-package-modal',
    loadComponent: () => import('./shared-components/modals/admin-package-modal/admin-package-modal.page').then( m => m.AdminPackageModalPage)
  },
  {
    path: 'admin-service-type-modal',
    loadComponent: () => import('./shared-components/modals/admin-service-type-modal/admin-service-type-modal.page').then( m => m.AdminServiceTypeModalPage)
  },
  {
    path: 'admin-service-modal',
    loadComponent: () => import('./shared-components/modals/admin-service-modal/admin-service-modal.page').then( m => m.AdminServiceModalPage)
  },
  {
    path: 'admin-sub-type-modal',
    loadComponent: () => import('./shared-components/modals/admin-sub-type-modal/admin-sub-type-modal.page').then( m => m.AdminSubTypeModalPage)
  },
  {
    path: 'admin-user-modal',
    loadComponent: () => import('./shared-components/modals/admin-user-modal/admin-user-modal.page').then( m => m.AdminUserModalPage)
  },
  {
    path: 'coupon-modal',
    loadComponent: () => import('./shared-components/modals/coupon-modal/coupon-modal.page').then( m => m.CouponModalPage)
  },
  {
    path: 'image-asset-modal',
    loadComponent: () => import('./shared-components/modals/image-asset-modal/image-asset-modal.page').then( m => m.ImageAssetModalPage)
  },
  {
    path: 'booking-details',
    loadComponent: () => import('./shared-components/modals/booking-details/booking-details.page').then( m => m.BookingDetailsPage)
  },
  {
    path: 'custom-select',
    loadComponent: () => import('./shared-components/components/custom-select/custom-select.page').then( m => m.CustomSelectPage)
  },
  {
    path: 'header-component',
    loadComponent: () => import('./shared-components/components/header-component/header-component.page').then( m => m.HeaderComponentPage)
  },
  {
    path: 'footer-component',
    loadComponent: () => import('./shared-components/components/footer-component/footer-component.page').then( m => m.FooterComponentPage)
  },
  {
    path: 'logo-spinner',
    loadComponent: () => import('./shared-components/components/logo-spinner/logo-spinner.page').then( m => m.LogoSpinnerPage)
  },
  {
    path: 'image-renderer-modal',
    loadComponent: () => import('./shared-components/modals/image-renderer-modal/image-renderer-modal.page').then( m => m.ImageRendererModalPage)
  },
  {
    path: 'product-list',
    loadComponent: () => import('./pages/user-interface/product-list/product-list.page').then( m => m.ProductListPage)
  },
  {
    path: 'service-list',
    loadComponent: () => import('./pages/user-interface/service-list/service-list.page').then( m => m.ServiceListPage)
  },
  {
    path: 'skeleton-loader',
    loadComponent: () => import('./shared-components/components/skeleton-loader/skeleton-loader.page').then( m => m.SkeletonLoaderPage)
  },
  {
    path: 'star-ratings',
    loadComponent: () => import('./shared-components/components/star-ratings/star-ratings.page').then( m => m.StarRatingsPage)
  },
  {
    path: 'user-agreement-policy',
    loadComponent: () => import('./shared-components/modals/user-agreement-policy/user-agreement-policy.page').then(m => m.UserAgreementPolicyPage)
  },
  {
    path: 'apply-coupon',
    loadComponent: () => import('./shared-components/modals/apply-coupon/apply-coupon.page').then( m => m.ApplyCouponPage)
  },
  {
    path: 'payment-success',
    loadComponent: () => import('./shared-components/modals/payment-success/payment-success.page').then( m => m.PaymentSuccessPage)
  },
  {
    path: 'payment-failure',
    loadComponent: () => import('./shared-components/modals/payment-failure/payment-failure.page').then( m => m.PaymentFailurePage)
  },
  {
    path: 'admin',
    component: AdminInterfacePage,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin-interface/admin-service-types/admin-service-types.page').then( m => m.AdminServiceTypesPage)
      },
      {
        path: 'admin-service-types',
        loadComponent: () => import('./pages/admin-interface/admin-service-types/admin-service-types.page').then( m => m.AdminServiceTypesPage)
      },
      {
        path: 'admin-sub-types',
        loadComponent: () => import('./pages/admin-interface/admin-sub-types/admin-sub-types.page').then( m => m.AdminSubTypesPage)
      },
      {
        path: 'admin-users',
        loadComponent: () => import('./pages/admin-interface/admin-users/admin-users.page').then( m => m.AdminUsersPage)
      },
      {
        path: 'coupons',
        loadComponent: () => import('./pages/admin-interface/coupons/coupons.page').then( m => m.CouponsPage)
      },
      {
        path: 'image-assets',
        loadComponent: () => import('./pages/admin-interface/image-assets/image-assets.page').then( m => m.ImageAssetsPage)
      },
      {
        path: 'admin-packages',
        loadComponent: () => import('./pages/admin-interface/admin-packages/admin-packages.page').then( m => m.AdminPackagesPage)
      },
      {
        path: 'admin-services',
        loadComponent: () => import('./pages/admin-interface/admin-services/admin-services.page').then( m => m.AdminServicesPage)
      },
    ]
  }
];
