import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleAppointmentPage } from './schedule-appointment.page';

describe('ScheduleAppointmentPage', () => {
  let component: ScheduleAppointmentPage;
  let fixture: ComponentFixture<ScheduleAppointmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScheduleAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
