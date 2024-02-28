import { TestBed } from '@angular/core/testing';

import { UserupdateService } from './firebase-userupdate.service';

describe('UserupdateService', () => {
  let service: UserupdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserupdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
