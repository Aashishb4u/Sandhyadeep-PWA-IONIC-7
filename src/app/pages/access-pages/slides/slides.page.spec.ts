import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlidesPage } from './slides.page';

describe('SlidesPage', () => {
  let component: SlidesPage;
  let fixture: ComponentFixture<SlidesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SlidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
