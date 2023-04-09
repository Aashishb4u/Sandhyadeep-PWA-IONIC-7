import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageAssetsPage } from './image-assets.page';

describe('ImageAssetsPage', () => {
  let component: ImageAssetsPage;
  let fixture: ComponentFixture<ImageAssetsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageAssetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
