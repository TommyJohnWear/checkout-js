export { default as renderCheckout } from '../app/checkout/renderCheckout';
export { default as renderOrderConfirmation } from '../app/order/renderOrderConfirmation';
export { initializeLanguageService } from '../app/locale/getLanguageService';

import initPaypal from './checkout/Paypal';
initPaypal();