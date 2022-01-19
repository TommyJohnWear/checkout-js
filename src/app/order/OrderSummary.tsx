import { LineItemMap, PhysicalItem, ShopperCurrency, StoreCurrency } from '@bigcommerce/checkout-sdk';
import { useStore } from '@nanostores/react';
import React, { useEffect, useMemo, FunctionComponent, ReactNode } from 'react';

import { shippingAddress, zonosAmounts } from '../../store';

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
    shippingAmount,
    ...orderSummarySubtotalsProps
}) => {
    const nonBundledLineItems = useMemo(() => (
        removeBundledItems(lineItems)
    ), [lineItems]);

    const shippingAddressAtom = useStore(shippingAddress);
    const { subtotalAmount } = orderSummarySubtotalsProps;

    useEffect(() => {
        // TODO: use wretch
        const fetchZonos = async (items: PhysicalItem[]) => {
            try {
                if (items.length) {
                    const res = await fetch('https://api.tommyjohn.io/api/zonos',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            currency: 'USD',
                            discounts: [],
                            items,
                            shippingAmount: shippingAmount || 0,
                            shippingAddress: shippingAddressAtom,
                        }),
                    });

                    const { ok, data } = await res.json();

                    if (ok) {
                        const fees = Object.entries(data.amount_subtotal).map(([key, val]) => ({
                            name: key[0].toUpperCase() + key.substring(1),
                            amount: val as number,
                        }));
                        zonosAmounts.set([{ name: 'Shipping', amount: data.customs.shipping_amount }].concat(fees));
                    }
                } else {
                    zonosAmounts.set(null);
                }

                return true;
            } catch (error) {
                // console.error('Failed to get Zonos data');
                zonosAmounts.set(null);
            }
        };

        (window as any).utag_data.line_items = lineItems;

        const countryCode = shippingAddressAtom?.countryCode;
        if (subtotalAmount > 40 && countryCode && countryCode !== 'US') {
            fetchZonos(lineItems?.physicalItems ?? []).catch(console.error);
        }
    }, [lineItems, shippingAddressAtom, shippingAmount, subtotalAmount]);

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
