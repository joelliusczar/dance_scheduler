import { TestBed } from '@angular/core/testing';

import { BrowserDbService } from './browser-db.service';

describe('BrowserDbService', () => {
  let service: BrowserDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
