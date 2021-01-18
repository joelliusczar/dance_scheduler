import { TestBed } from '@angular/core/testing';

import { OpQueueService } from './op-queue.service';

describe('OpQueueService', () => {
  let service: OpQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
