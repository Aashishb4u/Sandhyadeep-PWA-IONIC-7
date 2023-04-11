import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyCouponPage } from './apply-coupon.page';

describe('ApplyCouponPage', () => {
  let component: ApplyCouponPage;
  let fixture: ComponentFixture<ApplyCouponPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApplyCouponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
