import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarRatingsPage } from './star-ratings.page';

describe('StarRatingsPage', () => {
  let component: StarRatingsPage;
  let fixture: ComponentFixture<StarRatingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StarRatingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
