import { atom } from 'nanostores';

export const customerPhone = atom<string | undefined>(undefined);
export const isSubscribedToText = atom<boolean>(false);
export const checkoutID = atom<string | undefined>(undefined);
export const checkoutProductID = atom<object | []>([]);
export const checkoutProductInformation = atom<object | []>([]);
export const sanityData = atom<object | []>([]);
export const productsApplicableFor3For48Promo = atom<object | []>([]);



const unsubAbandonCart = customerPhone.subscribe(async value => {
  const passRegex = value && /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value);

  if (passRegex) {
    console.log(`Sending text to ${value}`);

    try {
      const res = await fetch('https://functions.tommyjohn.com/api/abandon-checkout', {
        method: 'POST',
        body: JSON.stringify({ phone: value }),
      });

      if (res.status === 200) {
        unsubAbandonCart();
      }
    } catch (error) {
      console.error(error);
    }
  }
});
