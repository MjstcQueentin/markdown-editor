import { TestBed } from '@angular/core/testing';

import { EditorOptionsService } from './editor-options.service';

describe('EditorOptionsService', () => {
  let service: EditorOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
