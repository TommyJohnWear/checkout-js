import React, { memo, FunctionComponent } from 'react';

import { ShopperCurrency } from '../currency';
import { TranslatedString } from '../locale';

import OrderSummaryPrice, { OrderSummaryPriceProps } from './OrderSummaryPrice';
import { checkoutID, productsApplicableFor3For48Promo } from '../../store';


const check = async () => {
    let cartProducts:any = productsApplicableFor3For48Promo.get();
    cartProducts = cartProducts.map((p:any) => ({
      "product_id": p.productId,
      "variant_id": p.variantId,
      "quantity": p.quantity,
      "list_price": 16,
      "lineItemID": p.itemId
    }))

    for(let products of cartProducts) {
      try {
        let url = 'https://deploy-preview-1118--tj-bc.netlify.app/api/update-users-cart';
        let options = {
          method: "POST",
          body: JSON.stringify({
            itemId: products.lineItemID,
            productId: products.product_id,
            variantId: products.variant_id,
            quantity: products.quantity,
            price:  products.list_price,
            cartID: checkoutID.get()
          })
        }
        await fetch(url, options);
        window.location.reload();
      } catch (error) {
        console.log('error'+ error);
      }
    }


  return 1;
  }

export interface OrderSummaryDiscountProps extends OrderSummaryPriceProps {
    remaining?: number;
    code?: string;
    onRemoved?(code: string): void;
}

const OrderSummaryDiscount: FunctionComponent<OrderSummaryDiscountProps> = ({
    code,
    remaining,
    amount,
    onRemoved,
    ...rest
}) => (
    <OrderSummaryPrice
        { ...rest }
        { ...code && { label: <span className="cart-price-code" data-test="cart-price-code">
            { code }
        </span> } }
        { ...(onRemoved && {
            onActionTriggered: () => code && onRemoved(code) && check(),
            actionLabel: <TranslatedString id="cart.remove_action" />,
        }) }
        amount={ -1 * (amount || 0) }
    >
        { !!remaining && remaining > 0 && <span
            className="cart-priceItem-postFix optimizedCheckout-contentSecondary"
            data-test="cart-price-remaining"
        >
            <TranslatedString id="cart.remaining_text" />
            { ': ' }
            <ShopperCurrency amount={ remaining } />
        </span> }

        { /* code && <span
            className="cart-priceItem-postFix optimizedCheckout-contentSecondary"
            data-test="cart-price-code"
        >
            { code }
        </span> */ }
    </OrderSummaryPrice>
);

export default memo(OrderSummaryDiscount);
