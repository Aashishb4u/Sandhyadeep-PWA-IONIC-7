import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageAssetModalPage } from './image-asset-modal.page';

describe('ImageAssetModalPage', () => {
  let component: ImageAssetModalPage;
  let fixture: ComponentFixture<ImageAssetModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageAssetModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
