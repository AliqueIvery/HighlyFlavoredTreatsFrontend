import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsSettingsComponent } from './payments-settings.component';

describe('PaymentsSettingsComponent', () => {
  let component: PaymentsSettingsComponent;
  let fixture: ComponentFixture<PaymentsSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsSettingsComponent]
    });
    fixture = TestBed.createComponent(PaymentsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
