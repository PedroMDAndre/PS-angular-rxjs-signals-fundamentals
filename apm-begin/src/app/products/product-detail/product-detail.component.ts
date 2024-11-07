import { Component, computed, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
})
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  // Product to display
  readonly product = this.productService.product;
  readonly errorMessage = this.productService.productError;

  // Set the page title

  readonly pageTitle = computed(() =>
    this.product()
      ? `Product Detail for: ${this.product()?.productName}`
      : 'Product Detail'
  );

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }
}
