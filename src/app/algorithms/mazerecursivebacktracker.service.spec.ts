import { TestBed } from '@angular/core/testing';

import { MazerecursivebacktrackerService } from './mazerecursivebacktracker.service';

describe('MazerecursivebacktrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MazerecursivebacktrackerService = TestBed.get(MazerecursivebacktrackerService);
    expect(service).toBeTruthy();
  });
});
