import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSubTypeModalPage } from './admin-sub-type-modal.page';

describe('AdminSubTypeModalPage', () => {
  let component: AdminSubTypeModalPage;
  let fixture: ComponentFixture<AdminSubTypeModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminSubTypeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
