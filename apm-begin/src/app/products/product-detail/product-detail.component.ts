import { Component, inject, Input } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, first, tap } from 'rxjs';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe],
})
export class ProductDetailComponent {
  errorMessage = '';

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);


  // Product to display
  readonly product$ = this.productService.product$.pipe(
    catchError((error) => {
      this.errorMessage = error;
      return EMPTY;
    })
  );

  // Set the page title
  // pageTitle = this.product
  //   ? `Product Detail for: ${this.product.productName}`
  //   : 'Product Detail';
  pageTitle = 'Product Detail';

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }
}
