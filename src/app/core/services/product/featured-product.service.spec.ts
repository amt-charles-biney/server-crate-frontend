import { TestBed } from '@angular/core/testing';

import { FeaturedProductService } from './featured-product.service';

describe('FeaturedProductService', () => {
  let service: FeaturedProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
