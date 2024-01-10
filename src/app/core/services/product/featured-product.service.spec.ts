import { TestBed, inject } from '@angular/core/testing';
import { FeaturedProductService } from './featured-product.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';

describe('FeaturedProductService', () => {
  let service: FeaturedProductService;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeaturedProductService]
    });
    service = TestBed.inject(FeaturedProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve featured products from API via GET', () => {
    const mockFeaturedProducts: any[] = [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ];

    service.getFeaturedProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockFeaturedProducts);
    });

    const req = httpTestingController.expectOne(`${environment.base_url}/featured`);
    expect(req.request.method).toBe('GET');

    req.flush(mockFeaturedProducts);
  });

});
