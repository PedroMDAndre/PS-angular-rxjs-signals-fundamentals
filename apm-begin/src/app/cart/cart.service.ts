import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from './cart';
import { Product } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly cartItems = signal<CartItem[]>([]);
  readonly cardCount = computed(() =>
    this.cartItems().reduce((accQty, item) => accQty + item.quantity, 0)
  );

  readonly subTotal = computed(() =>
    this.cartItems().reduce(
      (subTotal, item) => subTotal + item.quantity * item.product.price,
      0
    )
  );
  readonly deliveryFee = computed<number>(() =>
    this.subTotal() < 50 ? 5.99 : 0
  );
  readonly tax = computed(() => Math.round((this.subTotal() * 10.75) / 100));
  readonly totalPrice = computed(
    () => this.subTotal() + this.deliveryFee() + this.tax()
  );

  eLength = effect(() =>
    console.log('Cart array length', this.cartItems().length)
  );

  addItem(product: Product): void {
    this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update((cartItems) =>
      cartItems.map((item) =>
        item.product.id === cartItem.product.id ? { ...item, quantity } : item
      )
    );
  }

  removeFromCart(cartItem: CartItem) {
    this.cartItems.update((cartItems) =>
      cartItems.filter((item) => item.product.id !== cartItem.product.id)
    );
  }
}
