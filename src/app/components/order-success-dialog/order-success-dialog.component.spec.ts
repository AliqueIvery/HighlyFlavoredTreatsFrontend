import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSuccessDialogComponent } from './order-success-dialog.component';

describe('OrderSuccessDialogComponent', () => {
  let component: OrderSuccessDialogComponent;
  let fixture: ComponentFixture<OrderSuccessDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSuccessDialogComponent]
    });
    fixture = TestBed.createComponent(OrderSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
