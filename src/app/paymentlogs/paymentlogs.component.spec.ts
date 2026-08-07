import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentlogsComponent } from './paymentlogs.component';

describe('PaymentlogsComponent', () => {
  let component: PaymentlogsComponent;
  let fixture: ComponentFixture<PaymentlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentlogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
