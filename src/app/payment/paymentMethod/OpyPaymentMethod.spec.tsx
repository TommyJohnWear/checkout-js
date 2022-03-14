import { createCheckoutService, CheckoutService, CheckoutStoreSelector, PaymentMethod } from '@bigcommerce/checkout-sdk';
import { mount, render } from 'enzyme';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React, { FunctionComponent } from 'react';

import { CheckoutProvider } from '../../checkout';
import { getCheckout } from '../../checkout/checkouts.mock';
import { getStoreConfig } from '../../config/config.mock';
import { getCustomer } from '../../customer/customers.mock';
import { createLocaleContext, LocaleContext, LocaleContextType } from '../../locale';
import { LoadingOverlay } from '../../ui/loading';
import { getPaymentMethod } from '../payment-methods.mock';
import PaymentContext, { PaymentContextProps } from '../PaymentContext';

import HostedWidgetPaymentMethod from './HostedWidgetPaymentMethod';
import OpyPaymentMethod, { OpyPaymentMethodProps } from './OpyPaymentMethod';

describe('when using Opy payment', () => {
    let checkoutService: CheckoutService;
    let paymentContext: PaymentContextProps;
    let localeContext: LocaleContextType;
    let method: PaymentMethod;
    let defaultProps: OpyPaymentMethodProps;
    let OpyPaymentMethodTest: FunctionComponent;
    let checkoutState: CheckoutStoreSelector;

    beforeEach(() => {
        checkoutService = createCheckoutService();
        paymentContext = {
            disableSubmit: jest.fn(),
            setSubmit: jest.fn(),
            setValidationSchema: jest.fn(),
            hidePaymentSubmitButton: jest.fn(),
        };
        localeContext = createLocaleContext(getStoreConfig());

        method = {
            ...getPaymentMethod(),
            id: 'opy',
        };
        defaultProps = {
            deinitializePayment: jest.fn(),
            initializePayment: jest.fn(),
            method,
        };

        OpyPaymentMethodTest = props => (
            <CheckoutProvider checkoutService={ checkoutService }>
                <PaymentContext.Provider value={ paymentContext }>
                    <LocaleContext.Provider value={ localeContext }>
                        <Formik
                            initialValues={ {} }
                            onSubmit={ noop }
                        >
                            <OpyPaymentMethod { ...defaultProps } { ...props } />
                        </Formik>
                    </LocaleContext.Provider>
                </PaymentContext.Provider>
            </CheckoutProvider>
        );

        checkoutState = checkoutService.getState().data;

        jest.spyOn(checkoutState, 'getCheckout')
            .mockReturnValue(getCheckout());

        jest.spyOn(checkoutState, 'getConfig')
            .mockReturnValue(getStoreConfig());

        jest.spyOn(checkoutState, 'getCustomer')
            .mockReturnValue(getCustomer());

        jest.spyOn(checkoutState, 'isPaymentDataRequired')
            .mockReturnValue(true);
    });

    it('initializes method with required config', () => {
        mount(<OpyPaymentMethodTest />);

        expect(defaultProps.initializePayment)
            .toHaveBeenCalledWith(expect.objectContaining({
                methodId: 'opy',
                opy: {
                    containerId: 'learnMoreButton',
                },
            }));
    });

    it('renders as HostedWidgetPaymentMethod', () => {
        const container = mount(<OpyPaymentMethodTest />);

        expect(container.find(HostedWidgetPaymentMethod).props())
            .toEqual(expect.objectContaining({
                containerId: 'learnMoreButton',
                hideWidget: false,
                initializePayment: expect.any(Function),
                method,
            }));
    });

    it('renders loading overlay while it\'s initializing', () => {
        defaultProps.isInitializing = true;

        const container = mount(<OpyPaymentMethodTest />);
        const overlay = container.find(HostedWidgetPaymentMethod).closest(LoadingOverlay);

        expect(overlay.prop('hideContentWhenLoading')).toEqual(true);
        expect(overlay.prop('isLoading')).toEqual(true);
    });

    it('renders the expected copy', () => {
        defaultProps.method.config.displayName = 'Foo Payment Method';

        const container = mount(<OpyPaymentMethodTest />);

        const text1 = localeContext.language.translate('payment.opy_widget_slogan');
        const text2 = localeContext.language.translate('payment.opy_widget_info', { methodName: 'Foo Payment Method' });
        const text3 = localeContext.language.translate('payment.opy_continue_action', { methodName: 'Foo Payment Method' });

        expect(container.text().includes(text1)).toBe(true);
        expect(container.text().includes(text2)).toBe(true);
        expect(container.text().includes(text3)).toBe(true);
    });

    it('matches snapshot with rendered output', () => {
        defaultProps.method.config.displayName = 'Opy';

        const component = render(<OpyPaymentMethodTest />);

        expect(component).toMatchSnapshot();
    });
});
