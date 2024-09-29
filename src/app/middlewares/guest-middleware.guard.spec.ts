import { TestBed } from '@angular/core/testing';

import { GuestMiddlewareGuard } from './guest-middleware.guard';

describe('GuestMiddlewareGuard', () => {
  let guard: GuestMiddlewareGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuestMiddlewareGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
