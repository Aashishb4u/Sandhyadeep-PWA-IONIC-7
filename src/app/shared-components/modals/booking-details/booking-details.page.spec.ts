import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingDetailsPage } from './booking-details.page';

describe('BookingDetailsPage', () => {
  let component: BookingDetailsPage;
  let fixture: ComponentFixture<BookingDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookingDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
