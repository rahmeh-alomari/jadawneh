import { TestBed } from '@angular/core/testing';

import { BaseResolver } from './base.resolver';

describe('BaseResolver', () => {
  let resolver: BaseResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BaseResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
