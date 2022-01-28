import { Coupon, GiftCertificate, Tax } from '@bigcommerce/checkout-sdk';
import React, { memo, useEffect, Fragment, FunctionComponent } from 'react';

import { TranslatedString } from '../locale';

import OrderSummaryDiscount from './OrderSummaryDiscount';
import OrderSummaryPrice from './OrderSummaryPrice';

export interface OrderSummarySubtotalsProps {
    coupons?: Coupon[];
    giftCertificates?: GiftCertificate[];
    discountAmount?: number;
    taxes?: Tax[];
    giftWrappingAmount?: number;
    shippingAmount?: number;
    handlingAmount?: number;
    storeCreditAmount?: number;
    subtotalAmount: number;
    onRemovedGiftCertificate?(code: string): void;
    onRemovedCoupon?(code: string): void;
}

const OrderSummarySubtotals: FunctionComponent<OrderSummarySubtotalsProps> = ({
    coupons,
    discountAmount,
    taxes,
    giftWrappingAmount,
    shippingAmount,
    subtotalAmount,
    handlingAmount,
    storeCreditAmount,
    onRemovedCoupon,
}) => {
    useEffect(() => {
        (window as any).utag_data.sub_total = subtotalAmount || 0;
        (window as any).utag_data.discount_amount = discountAmount || 0;
    }, [subtotalAmount, discountAmount]);

    useEffect(() => {
        (window as any).utag_data.coupons = coupons;
    }, [coupons]);

    return (<Fragment>
        <OrderSummaryPrice
            amount={ subtotalAmount }
            className="cart-priceItem--subtotal"
            label={ <TranslatedString id="cart.subtotal_text" /> }
            testId="cart-subtotal"
        />

        { (coupons || [])
            .map((coupon, index) =>
                <OrderSummaryDiscount
                    amount={ coupon.discountedAmount }
                    code={ coupon.code }
                    key={ index }
                    label={ coupon.displayName }
                    onRemoved={ onRemovedCoupon }
                    testId="cart-coupon"
                />
        ) }

        { !!discountAmount && <OrderSummaryDiscount
            amount={ discountAmount }
            label={ <TranslatedString id="cart.discount_text" /> }
            testId="cart-discount"
        /> }

        { !!giftWrappingAmount && <OrderSummaryPrice
            amount={ giftWrappingAmount }
            label={ <TranslatedString id="cart.gift_wrapping_text" /> }
            testId="cart-gift-wrapping"
        /> }

        <OrderSummaryPrice
            amount={ shippingAmount }
            label={ <TranslatedString id="cart.shipping_text" /> }
            testId="cart-shipping"
            zeroLabel={ <TranslatedString id="cart.free_text" /> }
        />

        { !!handlingAmount && <OrderSummaryPrice
            amount={ handlingAmount }
            label={ <TranslatedString id="cart.handling_text" /> }
            testId="cart-handling"
        /> }

        { (taxes || [])
            .map(({ name, amount }, index) =>
                <OrderSummaryPrice
                    amount={ amount }
                    key={ index }
                    label={ name }
                    testId="cart-taxes"
                />
         ) }

        { !!storeCreditAmount && <OrderSummaryDiscount
            amount={ storeCreditAmount }
            label={ <TranslatedString id="cart.store_credit_text" /> }
            testId="cart-store-credit"
        /> }
    </Fragment>);
};

export default memo(OrderSummarySubtotals);
