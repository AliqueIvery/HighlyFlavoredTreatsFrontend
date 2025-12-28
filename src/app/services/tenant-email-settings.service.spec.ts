import { TestBed } from '@angular/core/testing';

import { TenantEmailSettingsService } from './tenant-email-settings.service';

describe('TenantEmailSettingsService', () => {
  let service: TenantEmailSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantEmailSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
