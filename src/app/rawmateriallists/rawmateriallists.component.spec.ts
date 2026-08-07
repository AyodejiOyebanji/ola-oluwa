import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawmateriallistsComponent } from './rawmateriallists.component';

describe('RawmateriallistsComponent', () => {
  let component: RawmateriallistsComponent;
  let fixture: ComponentFixture<RawmateriallistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawmateriallistsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawmateriallistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
