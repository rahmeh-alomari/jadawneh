import { TestBed } from '@angular/core/testing';

import { StaticPlayerService } from './static-player.service';

describe('StaticPlayerService', () => {
  let service: StaticPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
