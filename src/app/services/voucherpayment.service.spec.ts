import { TestBed } from '@angular/core/testing';

import { VoucherpaymentService } from './voucherpayment.service';

describe('VoucherpaymentService', () => {
  let service: VoucherpaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherpaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
