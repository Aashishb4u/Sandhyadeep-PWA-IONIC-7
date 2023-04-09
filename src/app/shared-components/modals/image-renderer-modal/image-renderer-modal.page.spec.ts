import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageRendererModalPage } from './image-renderer-modal.page';

describe('ImageRendererModalPage', () => {
  let component: ImageRendererModalPage;
  let fixture: ComponentFixture<ImageRendererModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageRendererModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
