import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPackageModalPage } from './admin-package-modal.page';

describe('AdminPackageModalPage', () => {
  let component: AdminPackageModalPage;
  let fixture: ComponentFixture<AdminPackageModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminPackageModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
