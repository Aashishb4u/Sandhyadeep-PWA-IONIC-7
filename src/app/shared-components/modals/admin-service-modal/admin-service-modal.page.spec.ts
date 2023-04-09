import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminServiceModalPage } from './admin-service-modal.page';

describe('AdminServiceModalPage', () => {
  let component: AdminServiceModalPage;
  let fixture: ComponentFixture<AdminServiceModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminServiceModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
