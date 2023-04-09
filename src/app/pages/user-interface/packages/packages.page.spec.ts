import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackagesPage } from './packages.page';

describe('PackagesPage', () => {
  let component: PackagesPage;
  let fixture: ComponentFixture<PackagesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PackagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
