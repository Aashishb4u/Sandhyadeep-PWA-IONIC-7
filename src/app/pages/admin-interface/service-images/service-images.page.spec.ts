import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceImagesPage } from './service-images.page';

describe('ServiceImagesPage', () => {
  let component: ServiceImagesPage;
  let fixture: ComponentFixture<ServiceImagesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServiceImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
