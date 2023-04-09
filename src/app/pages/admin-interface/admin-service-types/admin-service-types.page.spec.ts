import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminServiceTypesPage } from './admin-service-types.page';

describe('AdminServiceTypesPage', () => {
  let component: AdminServiceTypesPage;
  let fixture: ComponentFixture<AdminServiceTypesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminServiceTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
