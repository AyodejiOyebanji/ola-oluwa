import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintpreviewshowallComponent } from './printpreviewshowall.component';

describe('PrintpreviewshowallComponent', () => {
  let component: PrintpreviewshowallComponent;
  let fixture: ComponentFixture<PrintpreviewshowallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintpreviewshowallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintpreviewshowallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
