import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponentPage } from './header-component.page';

describe('HeaderComponentPage', () => {
  let component: HeaderComponentPage;
  let fixture: ComponentFixture<HeaderComponentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HeaderComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
