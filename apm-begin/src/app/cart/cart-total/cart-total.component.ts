import { Component, inject } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-total',
  templateUrl: './cart-total.component.html',
  standalone: true,
  imports: [NgIf, CurrencyPipe],
})
export class CartTotalComponent {
  private readonly cartService = inject(CartService);
  
  readonly cartItems = this.cartService.cartItems;
  readonly subTotal = this.cartService.subTotal;
  readonly deliveryFee = this.cartService.deliveryFee;
  readonly tax = this.cartService.tax;
  readonly totalPrice = this.cartService.totalPrice;
}
