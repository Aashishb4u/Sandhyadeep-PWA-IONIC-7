import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSelectPage } from './custom-select.page';

describe('CustomSelectPage', () => {
  let component: CustomSelectPage;
  let fixture: ComponentFixture<CustomSelectPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
