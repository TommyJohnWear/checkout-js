import { LineItemMap, ShopperCurrency, StoreCurrency } from '@bigcommerce/checkout-sdk';
import React, { useEffect, useMemo, FunctionComponent, ReactNode } from 'react';

import removeBundledItems from './removeBundledItems';
import OrderSummaryHeader from './OrderSummaryHeader';
import OrderSummaryItems from './OrderSummaryItems';
import OrderSummarySection from './OrderSummarySection';
import OrderSummarySubtotals, { OrderSummarySubtotalsProps } from './OrderSummarySubtotals';
import OrderSummaryTotal from './OrderSummaryTotal';
export interface OrderSummaryProps {
    lineItems: LineItemMap;
    total: number;
    headerLink: ReactNode;
    storeCurrency: StoreCurrency;
    shopperCurrency: ShopperCurrency;
    additionalLineItems?: ReactNode;
}

const OrderSummary: FunctionComponent<OrderSummaryProps & OrderSummarySubtotalsProps> = ({
    storeCurrency,
    shopperCurrency,
    headerLink,
    additionalLineItems,
    lineItems,
    total,
    ...orderSummarySubtotalsProps
}) => {
    const nonBundledLineItems = useMemo(() => (
        removeBundledItems(lineItems)
    ), [lineItems]);

    const { shippingAmount, subtotalAmount, taxes } = orderSummarySubtotalsProps;

    useEffect(() => {
            (window as any).utag_data.shipping_amount = shippingAmount;
            (window as any).utag_data.tax_amount = taxes?.reduce((sum, { amount }) => sum + amount, 0) ?? 0;
            (window as any).utag_data.duty_amount = undefined;
            (window as any).utag_data.fees_amount = undefined;
        }
    , [shippingAmount, taxes]);

    return <article className="cart optimizedCheckout-orderSummary" data-test="cart">
        <OrderSummaryHeader>
            { headerLink }
        </OrderSummaryHeader>

        <OrderSummarySection>
            <OrderSummaryItems items={ nonBundledLineItems } />
        </OrderSummarySection>

        <OrderSummarySection>
            <OrderSummarySubtotals
                { ...orderSummarySubtotalsProps }
            />
        </OrderSummarySection>

        <OrderSummarySection>
            { additionalLineItems }
        </OrderSummarySection>

        <OrderSummarySection>
            <OrderSummaryTotal
                orderAmount={ total }
                orderSubAmount={ subtotalAmount }
                shopperCurrencyCode={ shopperCurrency.code }
                storeCurrencyCode={ storeCurrency.code }
            />
        </OrderSummarySection>
    </article>;
};

export default OrderSummary;
