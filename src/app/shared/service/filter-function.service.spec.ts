import { TestBed } from '@angular/core/testing';

import { FilterFunctionService } from './filter-function.service';

describe('FilterFunctionService', () => {
  let service: FilterFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
