import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSetUpComponent } from './voucher-set-up.component';

describe('VoucherSetUpComponent', () => {
  let component: VoucherSetUpComponent;
  let fixture: ComponentFixture<VoucherSetUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherSetUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherSetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
