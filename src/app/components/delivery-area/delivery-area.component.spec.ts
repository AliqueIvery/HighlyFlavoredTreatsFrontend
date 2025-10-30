import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAreaComponent } from './delivery-area.component';

describe('DeliveryAreaComponent', () => {
  let component: DeliveryAreaComponent;
  let fixture: ComponentFixture<DeliveryAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryAreaComponent]
    });
    fixture = TestBed.createComponent(DeliveryAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
