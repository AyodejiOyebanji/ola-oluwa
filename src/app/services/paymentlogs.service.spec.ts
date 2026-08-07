import { TestBed } from '@angular/core/testing';

import { PaymentlogsService } from './paymentlogs.service';

describe('PaymentlogsService', () => {
  let service: PaymentlogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentlogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
