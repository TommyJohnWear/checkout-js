import { CheckoutSelectors, CheckoutService } from '@bigcommerce/checkout-sdk';
import { memoizeOne } from '@bigcommerce/memoize';
import React, { Component, ReactNode } from 'react';

import { customerPhone } from '../../store';

import CheckoutContext from './CheckoutContext';

export interface CheckoutProviderProps {
    checkoutService: CheckoutService;
}

export interface CheckoutProviderState {
    checkoutState: CheckoutSelectors;
}

export default class CheckoutProvider extends Component<CheckoutProviderProps, CheckoutProviderState> {
    state: Readonly<CheckoutProviderState>;

    private unsubscribe?: () => void;

    private getContextValue = memoizeOne((checkoutService, checkoutState) => {
        return {
            checkoutService,
            checkoutState,
        };
    });

    constructor(props: Readonly<CheckoutProviderProps>) {
        super(props);

        this.state = {
            checkoutState: props.checkoutService.getState(),
        };
    }

    componentDidMount(): void {
        const { checkoutService } = this.props;

        this.unsubscribe = checkoutService.subscribe(checkoutState => {
                this.setState({ checkoutState });
                const { getShippingAddress } = checkoutState?.data ?? {};

                const phone = getShippingAddress()?.phone;
                if (customerPhone.get() !== phone) {
                    customerPhone.set(phone);
                }
            }
        );
       

        // const cartData = checkoutState?.data?.getCart();
        console.log('I was triggered during componentDidMount')
    }

    componentWillUnmount(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = undefined;
        }
    }

    render(): ReactNode {
        const { checkoutService, children } = this.props;
        const { checkoutState } = this.state;

        return (
            <CheckoutContext.Provider value={ this.getContextValue(checkoutService, checkoutState) }>
                { children }
            </CheckoutContext.Provider>
        );
    }
}
