import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletEachComponent } from './wallet-each.component';

describe('WalletEachComponent', () => {
  let component: WalletEachComponent;
  let fixture: ComponentFixture<WalletEachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletEachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletEachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
