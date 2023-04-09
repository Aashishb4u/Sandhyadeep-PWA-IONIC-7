import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAgreementPolicyPage } from './user-agreement-policy.page';

describe('UserAgreementPolicyPage', () => {
  let component: UserAgreementPolicyPage;
  let fixture: ComponentFixture<UserAgreementPolicyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserAgreementPolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
