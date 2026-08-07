import { TestBed } from '@angular/core/testing';

import { RawMaterialVoucherService } from './raw-material-voucher.service';

describe('RawMaterialVoucherService', () => {
  let service: RawMaterialVoucherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawMaterialVoucherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
