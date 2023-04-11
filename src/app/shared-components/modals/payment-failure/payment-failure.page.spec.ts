import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentFailurePage } from './payment-failure.page';

describe('PaymentFailurePage', () => {
  let component: PaymentFailurePage;
  let fixture: ComponentFixture<PaymentFailurePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentFailurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
