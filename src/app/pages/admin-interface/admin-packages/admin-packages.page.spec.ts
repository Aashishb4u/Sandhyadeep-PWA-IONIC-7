import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPackagesPage } from './admin-packages.page';

describe('AdminPackagesPage', () => {
  let component: AdminPackagesPage;
  let fixture: ComponentFixture<AdminPackagesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminPackagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
