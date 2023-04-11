import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentSuccessPage } from './payment-success.page';

describe('PaymentSuccessPage', () => {
  let component: PaymentSuccessPage;
  let fixture: ComponentFixture<PaymentSuccessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
