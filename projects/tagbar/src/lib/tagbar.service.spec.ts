import { TestBed } from '@angular/core/testing';

import { TagbarService } from './tagbar.service';

describe('TagbarService', () => {
  let service: TagbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
