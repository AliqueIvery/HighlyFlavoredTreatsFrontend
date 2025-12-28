import { TestBed } from '@angular/core/testing';

import { TenantStripeSettingsService } from './tenant-stripe-settings.service';

describe('TenantStripeSettingsService', () => {
  let service: TenantStripeSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantStripeSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
