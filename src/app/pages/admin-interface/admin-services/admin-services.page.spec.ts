import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminServicesPage } from './admin-services.page';

describe('AdminServicesPage', () => {
  let component: AdminServicesPage;
  let fixture: ComponentFixture<AdminServicesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
