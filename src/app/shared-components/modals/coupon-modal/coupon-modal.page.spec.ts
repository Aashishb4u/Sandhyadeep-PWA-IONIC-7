import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponModalPage } from './coupon-modal.page';

describe('CouponModalPage', () => {
  let component: CouponModalPage;
  let fixture: ComponentFixture<CouponModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CouponModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
