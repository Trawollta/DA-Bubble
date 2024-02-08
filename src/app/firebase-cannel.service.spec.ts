import { TestBed } from '@angular/core/testing';

import { FirebaseCannelService } from './firebase-cannel.service';

describe('FirebaseCannelService', () => {
  let service: FirebaseCannelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
