import { TestBed } from '@angular/core/testing';

import { HttpTokenInterceptorsService } from './http-token-interceptors.service';

describe('HttpTokenInterceptorsService', () => {
  let service: HttpTokenInterceptorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpTokenInterceptorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
