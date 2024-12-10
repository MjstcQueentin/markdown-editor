import { TestBed } from '@angular/core/testing';

import { FileSharerService } from './file-sharer.service';

describe('FileSharerService', () => {
  let service: FileSharerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSharerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
