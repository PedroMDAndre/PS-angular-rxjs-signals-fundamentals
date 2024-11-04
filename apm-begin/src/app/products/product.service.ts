import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsUrl = 'api/products';
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(HttpErrorService);
  private readonly reviewService = inject(ReviewService);

  readonly products$: Observable<Product[]> = this.http
    .get<Product[]>(this.productsUrl)
    .pipe(
      tap((p) => console.log(JSON.stringify(p))),
      shareReplay(1),
      catchError((err) => this.errorHandler(err))
    );

  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productUrl).pipe(
      tap(() => console.log('In http.get by id pipeline')),
      switchMap((product) => this.getProductWithReviews(product)),
      catchError((err) => this.errorHandler(err))
    );
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews })));
    }
    return of(product);
  }

  private errorHandler(error: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(error);
    return throwError(() => formattedMessage);
  }
}
