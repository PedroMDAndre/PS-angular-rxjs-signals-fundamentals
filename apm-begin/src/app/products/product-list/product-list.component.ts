import { Component, inject } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent],
})
export class ProductListComponent {
  pageTitle = 'Products';

  private readonly productService = inject(ProductService);

  // Selected product id to highlight the entry
  readonly selectedProductId = this.productService.productSelectedId;

  // Products
  readonly products = this.productService.products;
  readonly errorMessage = this.productService.productsError;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
  }
}
