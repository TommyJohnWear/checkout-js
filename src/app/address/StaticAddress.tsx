import { Address, CheckoutSelectors, Country, FormField, ShippingInitializeOptions } from '@bigcommerce/checkout-sdk';
import { isEmpty } from 'lodash';
import React, { memo, useEffect, FunctionComponent } from 'react';

import { withCheckout, CheckoutContextProps } from '../checkout';

import isValidAddress from './isValidAddress';
import localizeAddress from './localizeAddress';
import AddressType from './AddressType';
import './StaticAddress.scss';

export interface StaticAddressProps {
    address: Address;
    type?: AddressType;
}

export interface StaticAddressEditableProps extends StaticAddressProps {
    initialize?(options: ShippingInitializeOptions): Promise<CheckoutSelectors>;
}

interface WithCheckoutStaticAddressProps {
    countries?: Country[];
    fields?: FormField[];
}

const StaticAddress: FunctionComponent<StaticAddressEditableProps & WithCheckoutStaticAddressProps> = ({
    countries,
    fields,
    address: addressWithoutLocalization,
}) => {
    const address = localizeAddress(addressWithoutLocalization, countries);
    const isValid = !fields ? !isEmpty(address) : isValidAddress(
        address,
        fields.filter(field => !field.custom)
    );

    useEffect(() => {
        (window as any).utag_data.customer_first_name = address.firstName || '';
        (window as any).utag_data.customer_last_name = address.lastName || '';
        (window as any).utag_data.country_code = address.countryCode || '';
        (window as any).utag_data.customer_city = address.city || '';
        (window as any).utag_data.customer_state = address.stateOrProvince || '';
        (window as any).utag_data.customer_zip = address.postalCode || '';
    }, [address, addressWithoutLocalization]);

    return !isValid ? null : <div className="vcard checkout-address--static">
        {
            (address.firstName || address.lastName) &&
            <p className="fn address-entry">
                <span className="first-name">{ `${address.firstName} ` }</span>
                <span className="family-name">{ address.lastName }</span>
            </p>
        }

        {
            (address.phone || address.company) &&
            <p className="address-entry">
                <span className="company-name">{ `${address.company} ` }</span>
                <span className="tel">{ address.phone }</span>
            </p>
        }

        <div className="adr">
            <p className="street-address address-entry">
                <span className="address-line-1">{ `${address.address1} ` }</span>
                {
                    address.address2 &&
                    <span className="address-line-2">
                        { ` / ${address.address2 }` }
                    </span>
                }
            </p>

            <p className="address-entry">
                {
                    address.city &&
                    <span className="locality">{ `${address.city}, ` }</span>
                }
                {
                    address.localizedProvince &&
                    <span className="region">{ `${address.localizedProvince}, ` }</span>
                }
                {
                    address.postalCode &&
                    <span className="postal-code">{ `${address.postalCode} / ` }</span>
                }
                {
                    address.localizedCountry &&
                    <span className="country-name">{ `${address.localizedCountry} ` }</span>
                }
            </p>
        </div>
    </div>;
};

export function mapToStaticAddressProps(
    context: CheckoutContextProps,
    { address, type }: StaticAddressProps
): WithCheckoutStaticAddressProps | null {
    const {
        checkoutState: {
            data: {
                getBillingCountries,
                getBillingAddressFields,
                getShippingAddressFields,
            },
        },
    } = context;

    return {
        countries: getBillingCountries(),
        fields: type === AddressType.Billing ?
            getBillingAddressFields(address.countryCode) :
            type === AddressType.Shipping ?
            getShippingAddressFields(address.countryCode) :
            undefined,
    };
}

export default withCheckout(mapToStaticAddressProps)(memo(StaticAddress));
