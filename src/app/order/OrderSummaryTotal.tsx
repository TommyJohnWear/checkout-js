import React, { Fragment, FunctionComponent } from 'react';

import { withCurrency, TranslatedString, WithCurrencyProps } from '../locale';

import OrderSummaryPrice from './OrderSummaryPrice';

export interface OrderSummaryTotalProps {
  orderAmount: number;
  shopperCurrencyCode: string;
  storeCurrencyCode: string;
}

<<<<<<< HEAD
const OrderSummaryTotal: FunctionComponent<
  OrderSummaryTotalProps & WithCurrencyProps
> = ({ shopperCurrencyCode, storeCurrencyCode, orderAmount, currency }) => {
  const hasDifferentCurrency = shopperCurrencyCode !== storeCurrencyCode;
  const label = (
    <Fragment>
      { hasDifferentCurrency ? (
        <TranslatedString id="cart.estimated_total_text" />
      ) : (
        <TranslatedString id="cart.estimated_total_text" />
      ) }
      { ` (${shopperCurrencyCode})` }
    </Fragment>
  );
=======
const OrderSummaryTotal: FunctionComponent<OrderSummaryTotalProps & WithCurrencyProps> = ({
    shopperCurrencyCode,
    storeCurrencyCode,
    orderAmount,
    currency,
}) => {
    (window as any).utag_data.shop_curreny = shopperCurrencyCode || '';
    (window as any).utag_data.checkout_order_total = orderAmount || '';
>>>>>>> head-1176/new

  return (
    <Fragment>
      <OrderSummaryPrice
          amount={ orderAmount }
          className="cart-priceItem--total"
          label={ label }
          superscript={ hasDifferentCurrency ? '*' : undefined }
          testId="cart-total"
      />
      { hasDifferentCurrency && currency && (
        <p
            className="cart-priceItem--totalNote"
            data-test="cart-price-item-total-note"
        >
          <TranslatedString
              data={ {
              total: currency.toStoreCurrency(orderAmount),
              code: storeCurrencyCode,
            } }
              id="cart.billed_amount_text"
          />
        </p>
      ) }
    </Fragment>
  );
};

export default withCurrency(OrderSummaryTotal);
