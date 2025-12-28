import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantEmailSettingsComponent } from './tenant-email-settings.component';

describe('TenantEmailSettingsComponent', () => {
  let component: TenantEmailSettingsComponent;
  let fixture: ComponentFixture<TenantEmailSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TenantEmailSettingsComponent]
    });
    fixture = TestBed.createComponent(TenantEmailSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
