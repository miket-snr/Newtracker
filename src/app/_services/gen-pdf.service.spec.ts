import { TestBed } from '@angular/core/testing';

import { GenPdfService } from './gen-pdf.service';

describe('GenPdfService', () => {
  let service: GenPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
