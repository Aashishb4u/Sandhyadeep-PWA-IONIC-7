import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoSpinnerPage } from './logo-spinner.page';

describe('LogoSpinnerPage', () => {
  let component: LogoSpinnerPage;
  let fixture: ComponentFixture<LogoSpinnerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogoSpinnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
