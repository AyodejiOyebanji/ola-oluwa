import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMaterialVoucherComponent } from './new-material-voucher.component';

describe('NewMaterialVoucherComponent', () => {
  let component: NewMaterialVoucherComponent;
  let fixture: ComponentFixture<NewMaterialVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMaterialVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMaterialVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
