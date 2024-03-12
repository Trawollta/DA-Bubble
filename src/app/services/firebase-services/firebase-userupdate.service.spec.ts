import { TestBed } from '@angular/core/testing';

import { FirebaseUserupdateService } from './firebase-userupdate.service';

describe('UserupdateService', () => {
  let service: FirebaseUserupdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseUserupdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});