import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllreceiptComponent } from './show-allreceipt.component';

describe('ShowAllreceiptComponent', () => {
  let component: ShowAllreceiptComponent;
  let fixture: ComponentFixture<ShowAllreceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAllreceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAllreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
