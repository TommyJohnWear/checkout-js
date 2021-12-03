import React, { Fragment, FunctionComponent } from 'react';

import { withCurrency, TranslatedString, WithCurrencyProps } from '../locale';

import OrderSummaryPrice from './OrderSummaryPrice';

declare let utag_data: any;
export interface OrderSummaryTotalProps {
    orderAmount: number;
    shopperCurrencyCode: string;
    storeCurrencyCode: string;
}

const OrderSummaryTotal: FunctionComponent<OrderSummaryTotalProps & WithCurrencyProps> = ({
    shopperCurrencyCode,
    storeCurrencyCode,
    orderAmount,
    currency,
}) => {

    utag_data.shop_currency = shopperCurrencyCode;
    utag_data.checkout_order_total = orderAmount;
    const hasDifferentCurrency = shopperCurrencyCode !== storeCurrencyCode;
    const label = <Fragment>
        { hasDifferentCurrency ?
            <TranslatedString id="cart.estimated_total_text" /> :
            <TranslatedString id="cart.total_text" /> }
        { ` (${shopperCurrencyCode})` }
    </Fragment>;

    return (
        <Fragment>
            <OrderSummaryPrice
                amount={ orderAmount }
                className="cart-priceItem--total"
                label={ label }
                superscript={ hasDifferentCurrency ? '*' : undefined }
                testId="cart-total"
            />
            { hasDifferentCurrency && currency && <p
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
            </p> }
        </Fragment>
    );
};

export default withCurrency(OrderSummaryTotal);
