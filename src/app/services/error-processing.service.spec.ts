import { TestBed } from '@angular/core/testing';

import { ErrorProcessingService } from './error-processing.service';

describe('ErrorProcessingService', () => {
  let service: ErrorProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
