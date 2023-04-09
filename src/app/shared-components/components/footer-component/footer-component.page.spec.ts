import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponentPage } from './footer-component.page';

describe('FooterComponentPage', () => {
  let component: FooterComponentPage;
  let fixture: ComponentFixture<FooterComponentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FooterComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
