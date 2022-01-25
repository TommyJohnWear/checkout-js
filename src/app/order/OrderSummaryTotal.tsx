import { useStore } from '@nanostores/react';
import React, { useEffect, useState, Fragment, FunctionComponent } from 'react';

import { zonosAmounts } from '../../store';
import { withCurrency, TranslatedString, WithCurrencyProps } from '../locale';

import OrderSummaryPrice from './OrderSummaryPrice';

export interface OrderSummaryTotalProps {
  orderAmount: number;
  orderSubAmount: number;
  shopperCurrencyCode: string;
  storeCurrencyCode: string;
}

const OrderSummaryTotal: FunctionComponent<
  OrderSummaryTotalProps & WithCurrencyProps
> = ({ shopperCurrencyCode, storeCurrencyCode, orderAmount, orderSubAmount, currency }) => {
  const zonosAmountsAtom = useStore(zonosAmounts);

  const [zonosTotal, setZonosTotal] = useState<null | number>(null);

  useEffect(() => {
    const total = zonosAmountsAtom?.length ? orderSubAmount + zonosAmountsAtom?.reduce((sum, { amount: val }) => sum + val, 0) : null;
    setZonosTotal(total);
  }, [zonosAmountsAtom, orderSubAmount]);

  useEffect(() => {
    (window as any).utag_data.checkout_order_total = zonosTotal || orderAmount || '';
  }, [zonosTotal, orderAmount]);

  (window as any).utag_data.shop_curreny = shopperCurrencyCode || '';

  const hasDifferentCurrency = shopperCurrencyCode !== storeCurrencyCode;
  const label = (
    <Fragment>
      { hasDifferentCurrency ? (
        <TranslatedString id="cart.estimated_total_text" />
      ) : (
        <TranslatedString id="cart.estimated_total_text" />
      ) }
      { /* { ` (${shopperCurrencyCode})` } */ }
    </Fragment>
  );

  return (
    <Fragment>
      <OrderSummaryPrice
          amount={ zonosTotal || orderAmount }
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
