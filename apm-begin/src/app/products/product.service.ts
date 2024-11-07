import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  filter,
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
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsUrl = 'api/products';
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(HttpErrorService);
  private readonly reviewService = inject(ReviewService);

  readonly productSelectedId = signal<number | undefined>(undefined);

  private readonly productsResult$ = this.http
    .get<Product[]>(this.productsUrl)
    .pipe(
      map((p) => ({ data: p } as Result<Product[]>)),
      tap((p) => console.log(JSON.stringify(p))),
      shareReplay(1),
      catchError((err) =>
        of({
          data: [],
          error: this.errorService.formatError(err),
        } as Result<Product[]>)
      )
    );

  private readonly productsResult = toSignal(this.productsResult$, {
    initialValue: { data: [] } as Result<Product[]>,
  });

  readonly products = computed(() => this.productsResult().data);
  readonly productsError = computed(() => this.productsResult().error);

  private readonly productResult$ = toObservable(this.productSelectedId).pipe(
    filter(Boolean),
    map((productId) => `${this.productsUrl}/${productId}`),
    switchMap((productUrl) => this.http.get<Product>(productUrl)),
    switchMap((product) => this.getProductWithReviews(product)),
    map((product) => ({ data: product } as Result<Product>)),
    catchError((err) =>
      of({
        data: undefined,
        error: this.errorService.formatError(err),
      } as Result<Product>)
    )
  );

  private readonly productResult = toSignal(this.productResult$, {
    initialValue: { data: undefined } as Result<Product>,
  });

  readonly product = computed(() => this.productResult()?.data);
  readonly productError = computed(() => this.productResult()?.error);

  productSelected(selectedProductId: number): void {
    this.productSelectedId.set(selectedProductId);
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
