import { TestBed } from '@angular/core/testing';

import { ActtypeService } from './acttype.service';

describe('ActtypeService', () => {
  let service: ActtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
