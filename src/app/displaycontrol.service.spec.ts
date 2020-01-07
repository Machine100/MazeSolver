import { TestBed } from '@angular/core/testing';

import { DisplaycontrolService } from './displaycontrol.service';

describe('DisplaycontrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplaycontrolService = TestBed.get(DisplaycontrolService);
    expect(service).toBeTruthy();
  });
});
