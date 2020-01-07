import { TestBed } from '@angular/core/testing';

import { BreadthfirstService } from './breadthfirst.service';

describe('BreadthfirstService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BreadthfirstService = TestBed.get(BreadthfirstService);
    expect(service).toBeTruthy();
  });
});
