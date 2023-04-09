import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUserModalPage } from './admin-user-modal.page';

describe('AdminUserModalPage', () => {
  let component: AdminUserModalPage;
  let fixture: ComponentFixture<AdminUserModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminUserModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
