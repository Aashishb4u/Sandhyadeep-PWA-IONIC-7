import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderPage } from './skeleton-loader.page';

describe('SkeletonLoaderPage', () => {
  let component: SkeletonLoaderPage;
  let fixture: ComponentFixture<SkeletonLoaderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SkeletonLoaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
