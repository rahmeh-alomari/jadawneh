import { TestBed } from '@angular/core/testing';

import { AuthMiddlewareGuard } from './auth-middleware.guard';

describe('AuthMiddlewareGuard', () => {
  let guard: AuthMiddlewareGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthMiddlewareGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
