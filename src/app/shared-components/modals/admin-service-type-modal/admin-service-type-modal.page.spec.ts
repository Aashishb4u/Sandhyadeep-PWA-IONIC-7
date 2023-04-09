import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminServiceTypeModalPage } from './admin-service-type-modal.page';

describe('AdminServiceTypeModalPage', () => {
  let component: AdminServiceTypeModalPage;
  let fixture: ComponentFixture<AdminServiceTypeModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminServiceTypeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
