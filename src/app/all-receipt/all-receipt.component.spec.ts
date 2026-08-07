import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReceiptComponent } from './all-receipt.component';

describe('AllReceiptComponent', () => {
  let component: AllReceiptComponent;
  let fixture: ComponentFixture<AllReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
