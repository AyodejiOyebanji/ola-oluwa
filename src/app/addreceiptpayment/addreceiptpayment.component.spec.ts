import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreceiptpaymentComponent } from './addreceiptpayment.component';

describe('AddreceiptpaymentComponent', () => {
  let component: AddreceiptpaymentComponent;
  let fixture: ComponentFixture<AddreceiptpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddreceiptpaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddreceiptpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
