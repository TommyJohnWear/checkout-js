import { CustomerInitializeOptions } from '@bigcommerce/checkout-sdk';
import React, { useCallback, useContext, useEffect, useState, FunctionComponent } from 'react';

import { navigateToOrderConfirmation } from '../../checkout';
import { LocaleContext } from '../../locale';
import CheckoutButton, { CheckoutButtonProps } from '../CheckoutButton';

const ApplePayButton: FunctionComponent<CheckoutButtonProps> = ({
    initialize,
    onError,
    ...rest
}) => {
    const localeContext = useContext(LocaleContext);
    const initializeOptions = useCallback((options: CustomerInitializeOptions) => initialize({
        ...options,
        applepay: {
            container: rest.containerId,
            shippingLabel: localeContext?.language.translate('cart.shipping_text'),
            subtotalLabel: localeContext?.language.translate('cart.subtotal_text'),
            onError,
            onPaymentAuthorize: navigateToOrderConfirmation,
        },
    }), [initialize, localeContext, onError, rest.containerId]);

    const [hasApplePay, setHasApplePay] = useState(false);

    useEffect(() => {
        if ((window as any)?.ApplePaySession) { setHasApplePay(true); }
    }, []);

    return hasApplePay ? <CheckoutButton initialize={ initializeOptions } { ...rest } /> : null;

};

export default ApplePayButton;
