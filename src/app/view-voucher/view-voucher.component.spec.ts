import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVoucherComponent } from './view-voucher.component';

describe('ViewVoucherComponent', () => {
  let component: ViewVoucherComponent;
  let fixture: ComponentFixture<ViewVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
