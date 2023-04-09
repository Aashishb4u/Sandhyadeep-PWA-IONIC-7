import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSubTypesPage } from './admin-sub-types.page';

describe('AdminSubTypesPage', () => {
  let component: AdminSubTypesPage;
  let fixture: ComponentFixture<AdminSubTypesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminSubTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
