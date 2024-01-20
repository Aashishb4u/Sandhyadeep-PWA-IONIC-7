import { TestBed } from '@angular/core/testing';

import { NewVersionCheckerService } from './new-version-checker.service';

describe('NewVersionCheckerService', () => {
  let service: NewVersionCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewVersionCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
