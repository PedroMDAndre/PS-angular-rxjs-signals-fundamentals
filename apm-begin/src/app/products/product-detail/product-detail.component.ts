import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError, EMPTY, first, tap } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
})
export class ProductDetailComponent implements OnChanges {
  @Input() productId: number = 0;
  errorMessage = '';

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product
    ? `Product Detail for: ${this.product.productName}`
    : 'Product Detail';

  private readonly productService = inject(ProductService);

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;

    if (id) {
      this.productService
        .getProduct(id)
        .pipe(
          first(),
          tap((product) => (this.product = product)),
          catchError((error) => {
            this.errorMessage = error;
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  addToCart(product: Product) {}
}
