import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackagesDetailsPage } from './packages-details.page';

describe('PackagesDetailsPage', () => {
  let component: PackagesDetailsPage;
  let fixture: ComponentFixture<PackagesDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PackagesDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
