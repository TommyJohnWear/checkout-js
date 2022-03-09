import { Address } from '@bigcommerce/checkout-sdk';
import { atom } from 'nanostores';

export const shippingAddress = atom<Address | null>(null);

export interface ZonosAmount {
  name: string;
  amount: number;
}

export const zonosAmounts = atom<ZonosAmount[] | null>(null);
