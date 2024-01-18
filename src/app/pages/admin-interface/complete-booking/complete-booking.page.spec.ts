import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompleteBookingPage } from './complete-booking.page';

describe('CompleteBookingPage', () => {
  let component: CompleteBookingPage;
  let fixture: ComponentFixture<CompleteBookingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompleteBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
