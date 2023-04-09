import { TestBed } from '@angular/core/testing';

import { CustomIonicStorageService } from './custom-ionic-storage.service';

describe('CustomIonicStorageService', () => {
  let service: CustomIonicStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomIonicStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
