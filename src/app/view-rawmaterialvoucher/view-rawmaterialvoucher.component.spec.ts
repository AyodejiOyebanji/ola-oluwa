import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRawmaterialvoucherComponent } from './view-rawmaterialvoucher.component';

describe('ViewRawmaterialvoucherComponent', () => {
  let component: ViewRawmaterialvoucherComponent;
  let fixture: ComponentFixture<ViewRawmaterialvoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRawmaterialvoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRawmaterialvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
