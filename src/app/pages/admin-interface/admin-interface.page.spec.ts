import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminInterfacePage } from './admin-interface.page';

describe('AdminInterfacePage', () => {
  let component: AdminInterfacePage;
  let fixture: ComponentFixture<AdminInterfacePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminInterfacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
