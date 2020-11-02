import { TestBed } from '@angular/core/testing';

import { CompetitionSetupService } from './competition-setup.service';

describe('ComponentSetupService', () => {
  let service: CompetitionSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetitionSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
