import { TestBed } from '@angular/core/testing';

import { DatePlanningService } from './date-planning.service';

describe('DatePlanningService', () => {
  let service: DatePlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatePlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
