import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';
import { BRANDS, CATEGORIES, PRODUCTS } from './admin.service.test';
import { ProductPayload, ProductResponse } from '../../../types';
import { HttpErrorResponse } from '@angular/common/http';

fdescribe('AdminService', () => {
  let service: AdminService;
  let httpTestingController: HttpTestingController;
  let base_url = environment.base_url;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all categories', () => {
    service.getCategories().subscribe((categories) => {
      expect(categories).toBeTruthy();
      expect(categories.length).toBe(5);

      const category = categories.find(
        (category) => category.id === '74bef6bc-d0b3-4ba5-821d-b7be8f244bd0'
      );

      expect(category).toBeTruthy();
      expect(category?.name).toBe('Category A');
    });

    const req = httpTestingController.expectOne(`${base_url}/admin/category`);
    expect(req.request.method).toEqual('GET');
    req.flush(CATEGORIES);
  }),
    it('should return an empty array when there are no categories', () => {
      service.getCategories().subscribe((categories) => {
        expect(categories).toBeTruthy();
        expect(categories.length).toBe(0);

        const category = categories.find(
          (category) => category.id === '74bef6bc-d0b3-4ba5-821d-b7be8f244bd0'
        );

        expect(category).toBeUndefined();
      });

      const req = httpTestingController.expectOne(`${base_url}/admin/category`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    }),
    it('it should return all brands', () => {
      service.getBrands().subscribe((brands) => {
        expect(brands.length).toBe(6);
        expect(brands).toBeTruthy();
        const brand = brands.find(
          (brand) => brand.id === '44f80d3f-01fe-4d9b-bd0b-fcd590d9e206'
        );
        expect(brand?.name).toBe('windows');
      });
      const req = httpTestingController.expectOne(`${base_url}/brand`);
      expect(req.request.method).toEqual('GET');
      req.flush(BRANDS);
    });
  it('it should return an empty array when there are no brands', () => {
    service.getBrands().subscribe((brands) => {
      expect(brands.length).toBe(0);
    });
    const req = httpTestingController.expectOne(`${base_url}/brand`);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });
  it('should add products', () => {
    const product: ProductPayload = {
      productName: 'Product C',
      productDescription: 'Product C',
      serviceCharge: '20',
      productId: 'f144fec7',
      category: 'Category C - None Selected',
      productCaseId: '06440588-5907-4d9b-ab0c-4787a7696d87',
      inStock: '3',
    };
    service.addProduct(product).subscribe((productResponse) => {
      expect(productResponse?.productName).toBe('Product C');
      expect(productResponse?.productCategory).toBe(
        'Category C - None Selected'
      );
      expect(productResponse?.productId).toBe('f144fec7');
    });

    const req = httpTestingController.expectOne(`${base_url}/admin/product`);
    expect(req.request.body.productName).toBe('Product C');
    expect(req.request.method).toBe('POST');
    const res: ProductResponse = {
      id: '7a670b17-c9b7-4519-be8b-20a0bd69fc37',
      productName: 'Product C',
      productDescription: 'Product C',
      productPrice: 40.8,
      productCasePrice: 34,
      baseConfigPrice: 0,
      productCase: 'ASUS Case',
      productCategory: 'Category C - None Selected',
      productId: 'f144fec7',
      imageUrl: [
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708763880/gkokgctpgvgubidhepzj.png',
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708763883/el6anccrtii8hwnyopji.png',
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708763886/fbe5us0mj1ppan1dqaxa.jpg',
      ],
      coverImage:
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708763878/jzk2xttgkddvzwsc7cmp.png',
      inStock: 3,
    };
    req.flush(res);

    service.getProducts(0).subscribe(({ products, total }) => {
      expect(total).toBe(5);
    });
    const request = httpTestingController.expectOne(
      `${base_url}/admin/product?page=${0}&size=9`
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      products: [...PRODUCTS.products, product],
      total: 5,
    });
  });
  it('should return an error for invalid category', () => {
    const product: ProductPayload = {
      productName: 'Alexandra Mcmahon',
      productDescription: 'Assumenda voluptatem',
      serviceCharge: '229',
      productId: '5789dfcb',
      productCaseId: '5ae76f55-5289-4ee6-9657-512e7bf53ab1',
      inStock: '0',
      category: '339',
    };
    service.addProduct(product).subscribe({
      next: () => fail('Invalid category'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpTestingController.expectOne(`${base_url}/admin/product`);
    expect(req.request.method).toBe('POST');
    req.flush('Adding product failed', {
      status: 404,
      statusText: 'Category not found',
    });
  });

  it('should get all products', () => {
    service.getProducts(0).subscribe(({ products, total }) => {
      expect(products.length).toBe(4);
      expect(total).toBe(4);
    });

    const req = httpTestingController.expectOne(
      `${base_url}/admin/product?page=${0}&size=9`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(PRODUCTS);
  });

  it('should get a single product', () => {
    service
      .getProduct('a90c71f2-d83d-4a07-a1da-169ebf02e458')
      .subscribe((product) => {
        expect(product.productName).toBe('Product Test');
      });

    const req = httpTestingController.expectOne(
      `${base_url}/admin/product/a90c71f2-d83d-4a07-a1da-169ebf02e458`
    );
    expect(req.request.method).toEqual('GET');
    req.flush({
      id: 'a90c71f2-d83d-4a07-a1da-169ebf02e458',
      productName: 'Product Test',
      productPrice: 2460,
      imageUrl: [
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708705138/iqr1vxknigvljvrirr3t.png',
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708705140/xvvgae0dphxkco3fddat.png',
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708705141/iykwqjrz89dl3ygukg2c.png',
      ],
      productBrand: 'Racket Case',
      coverImage:
        'http://res.cloudinary.com/dqtxt1g06/image/upload/v1708705136/jnjgivo9z6mzezvmnvl1.jpg',
      productId: '5789df1b',
      category: {
        name: 'Category E',
        id: 'dac610e1-cbfb-4e72-9586-dde681a97576',
      },
      productDescription: 'Assumenda voluptatem',
      serviceCharge: null,
      isFeatured: false,
      productAvailability: false,
      inStock: 1,
      stockStatus: 'Low Stock',
    });
  });
  it('should get an error when id is invalid', () => {
    service.getProduct('a90c71f2-d83d-4a07-a1da-169ebf02e459').subscribe({
      next: () => fail('Product id is invalid'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('product not found');
      },
    });

    const req = httpTestingController.expectOne(
      `${base_url}/admin/product/a90c71f2-d83d-4a07-a1da-169ebf02e459`
    );
    expect(req.request.method).toEqual('GET');
    req.flush('Product id is invalid', {
      status: 404,
      statusText: 'product not found',
    });
  });

  it('should delete a product', () => {
    service.deleteProduct('a90c71f2-d83d-4a07-a1da-169ebf02e458').subscribe();

    const req = httpTestingController.expectOne(
      `${base_url}/admin/product/a90c71f2-d83d-4a07-a1da-169ebf02e458`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});

    service.getProducts(0).subscribe(({ products, total }) => {
      expect(total).toBe(3);
    });
    const request = httpTestingController.expectOne(
      `${base_url}/admin/product?page=${0}&size=9`
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      products: [...PRODUCTS.products],
      total: 3,
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
