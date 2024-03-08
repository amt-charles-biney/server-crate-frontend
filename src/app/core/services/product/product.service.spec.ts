import { TestBed } from '@angular/core/testing'

import { ProductService } from './product.service'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ICategoryConfig, IConfiguredProduct, IParamConfigOptions, ProductItem } from '../../../types'

fdescribe('ProductService', () => {
  let service: ProductService
  let productController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    service = TestBed.inject(ProductService)
    productController = TestBed.inject(HttpTestingController)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should get particular product by id', () => {
    const productId = 1

    const product: ProductItem = {
      id: String(productId),
      productName: 'product 1',
      imageUrl: 'www/image/com',
      inStock: 0,
      isFeatured: false,
      serviceCharge: '',
      stockStatus: 'Available',
      productBrand: {
        name: 'NVIDEA',
        price: 200
      },
      productDescription: 'product description',
      productId: '1234',
      productPrice: '234',
      coverImage: '',
      sales: 0,
      category: {
        id: '12',
        name: 'category 1'
      },
      totalLeastStock: []
    }

    service.getProduct(String(productId)).subscribe((product: ProductItem) => {
      expect(product).toBeDefined()
      expect(product.id).toBe(String(productId))
    })

    const productRequest = productController.expectOne(`http://localhost:8080/api/v1/product/${productId}`)
    expect(productRequest.request.method).toEqual('GET')
    productRequest.flush(product)
  })

  it('should get product Configuration by category id', (done) => {
    const categoryId = '1'

    const categoryConfig: ICategoryConfig = {
      id: '1',
      category: {
        id: categoryId,
        name: 'category a'
      },
      options: {}
    }

    service.getProductConfiguration(categoryId).subscribe((config: ICategoryConfig) => {
      expect(config.category.id).toBe(categoryId)
      done()
    })

    const mockRequest = productController.expectOne(`http://localhost:8080/api/v1/category/${categoryId}/config`)
    expect(mockRequest.request.method).toEqual('GET')
    mockRequest.flush(categoryConfig)
  })

  it('should be able to get a product config item', (done) => {
    const productConfigItemId: string = '1'

    const productConfigItem: IConfiguredProduct = {
      id: productConfigItemId,
      totalPrice: 0,
      productName: 'test Product',
      productId: '1234',
      productPrice: 0,
      configuredPrice: 0,
      configured: [],
      warranty: false,
      vat: 0
    }

    const configOptions: IParamConfigOptions = {
      warranty: false,
      components: '1,2,3'
    }
    
    service.getProductConfigItem(productConfigItemId, configOptions).subscribe((productConfigItemSub: IConfiguredProduct) => {
      expect(productConfigItemSub.id).toBe(productConfigItemId)
      expect(productConfigItemSub.warranty).toBeFalse()
      done()
    })

    const mockRequest = productController.expectOne(`http://localhost:8080/api/v1/config/${productConfigItemId}?warranty=false&components=1,2,3`)
    expect(mockRequest.request.method).toEqual('GET')
    mockRequest.flush(productConfigItem)
  })

  afterEach(() => {
    productController.verify()
  })
})
