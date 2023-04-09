import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponsPage } from './coupons.page';

describe('CouponsPage', () => {
  let component: CouponsPage;
  let fixture: ComponentFixture<CouponsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CouponsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
