import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ProductConfigureComponent } from './product-configure.component'
import { RouterTestingModule } from '@angular/router/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { provideAnimations } from '@angular/platform-browser/animations'

fdescribe('ProductConfigureComponent', () => {
  let component: ProductConfigureComponent
  let fixture: ComponentFixture<ProductConfigureComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [provideAnimations(), provideMockStore()]
    }).compileComponents()

    fixture = TestBed.createComponent(ProductConfigureComponent)
    component = fixture.componentInstance
    fixture.autoDetectChanges()
  })

  it('should create', () => {
    console.log(component)
    expect(component).toBeDefined()
  })
})
