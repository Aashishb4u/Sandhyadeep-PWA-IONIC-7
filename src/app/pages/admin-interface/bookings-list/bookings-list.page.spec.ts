import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingsListPage } from './bookings-list.page';

describe('BookingsListPage', () => {
  let component: BookingsListPage;
  let fixture: ComponentFixture<BookingsListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookingsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
