import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceImageModalPage } from './service-image-modal.page';

describe('ServiceImageModalPage', () => {
  let component: ServiceImageModalPage;
  let fixture: ComponentFixture<ServiceImageModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServiceImageModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
