import { CheckoutSelectors,
  Coupon,
  GiftCertificate,
  RequestError } from '@bigcommerce/checkout-sdk';
import { memoizeOne } from '@bigcommerce/memoize';
import { withFormik, FieldProps, FormikProps } from 'formik';
import { noop } from 'lodash';
import React, { memo,
  useCallback,
  Fragment,
  FunctionComponent,
  KeyboardEvent } from 'react';
import { object, string } from 'yup';

import { preventDefault } from '../common/dom';
import { withLanguage, TranslatedString, WithLanguageProps } from '../locale';
import OrderSummaryDiscount from '../order/OrderSummaryDiscount';
import { Alert, AlertType } from '../ui/alert';
import { Button, ButtonVariant } from '../ui/button';
import { FormContextType,
  FormField,
  FormProvider,
  Label,
  TextInput } from '../ui/form';
import { Toggle } from '../ui/toggle';

// import AppliedRedeemables, { AppliedRedeemablesProps } from './AppliedRedeemables';
import { AppliedRedeemablesProps } from './AppliedRedeemables';
import { checkoutID, productsApplicableFor3For48Promo, is3For48PromoActive } from '../../store';

const getCouponData = async (code: any) => {
  const url = `https://deploy-preview-1118--tj-bc.netlify.app/api/coupon-info`;
    const options = {
      method: "POST",
      body: JSON.stringify({
        "couponCode": code
      }),
    };
    try {
      const res = await fetch(url, options);
      let couponData = await res.json();
      let stackCoupon = false;
      let rejectCoupon = false;
      let rejectCouponIfDiscountIsLess = false;

      console.log("++couponInfo====++",couponData);
      if(couponData && couponData.promos && couponData.promos.data && 
        couponData.promos.data[0]) {
            console.log("inf==1");
            if(couponData.promos.data[0].can_be_used_with_other_promotions && !couponData.promos.data[0].coupon_overrides_automatic_when_offering_higher_discounts) {
                stackCoupon = true;
                console.log("inf==2");
            } else if(!couponData.promos.data[0].can_be_used_with_other_promotions && !couponData.promos.data[0].coupon_overrides_automatic_when_offering_higher_discounts) {
              rejectCoupon = true;
                console.log("inf==3");
            } else if(!couponData.promos.data[0].can_be_used_with_other_promotions && couponData.promos.data[0].coupon_overrides_automatic_when_offering_higher_discounts) {
                console.log("inf==4");
                rejectCouponIfDiscountIsLess = true;
            }
        }
        return {
          stackCoupon,
          rejectCoupon,
          rejectCouponIfDiscountIsLess
        }
    } catch (err) {
      console.log("Coupon API Error:", err);
      return 0;
    }
}


const getCouponInfo = async (code: any) => {
  const url = `/api/storefront/checkouts/${checkoutID.get()}/coupons`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic Y3RfdXNlckB0b21teWpvaG4tUVc0TzdULkM3SDhORzphODIxMmYyYi03MTBkLTRiMDQtOWRjMC1lMGVlN2ViMjdiYWE=`,
      },
      body: JSON.stringify({
        "couponCode": code
      }),
    };
    try {
      const res = await fetch(url, options);
      const { coupons } = await res.json();
      let totalDiscount: any;
      if(coupons) {
        totalDiscount = coupons.filter((coupon: any) => coupon.code === code)
      
        if(totalDiscount.length && totalDiscount[0].discountedAmount) {
          totalDiscount = totalDiscount[0].discountedAmount
        }
        console.log(totalDiscount, "-1-+code0===",coupons);
        return totalDiscount;
      }
      return 0;
    } catch (err) {
      console.log("Coupon API Error:", err);
      return 0;
    }
}

const get3For48DiscountTotal = (cartProducts: any) => {
  let total3For48Discount = 0;
  cartProducts.forEach((item: any) => {
    total3For48Discount += ((item.quantity * item.price) - (item.quantity * 16));
  });
  return total3For48Discount;
}

const removeAppliedCoupon = async (code: any) => {
  let url = `/api/storefront/checkouts/${checkoutID.get()}/coupons/${code}`;
  
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic Y3RfdXNlckB0b21teWpvaG4tUVc0TzdULkM3SDhORzphODIxMmYyYi03MTBkLTRiMDQtOWRjMC1lMGVlN2ViMjdiYWE=`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log("removed", data);
  } catch (err) {
    console.log("Coupon API Error:", err);
    return 0;
  }
}

const displayPromoError = (displayPromoError: any) => {
  let promoErrorNodes = document.querySelectorAll('[data-error-section="promo-error"]');
  let couponContainer = document.querySelectorAll('.couponContainer');
  
  if(promoErrorNodes.length) {
    if(displayPromoError) {
      promoErrorNodes[0].setAttribute("style", "display:block;");
    } else {
      promoErrorNodes[0].setAttribute("style", "display:none;");
    }
  }

  if(couponContainer.length) {
    if(displayPromoError) {
      couponContainer[0].setAttribute("style", "display:none;");
    } else {
      couponContainer[0].setAttribute("style", "display:block;");
    }
  }
}

const updateCartWithOriginalProducts = async (cartProducts: any) => {
  cartProducts = cartProducts.map((p:any) => ({
    "product_id": p.productId,
    "variant_id": p.variantId,
    "quantity": p.quantity,
    "list_price": p.price,
    "lineItemID": p.itemId
  }))
  console.log("cartProducts----",cartProducts);

  for(let products of cartProducts) {
    try {
      let url = 'https://deploy-preview-1118--tj-bc.netlify.app/api/update-users-cart';
      let options = {
        method: "POST",
        body: JSON.stringify({
          itemId: products.lineItemID,
          productId: products.product_id,
          variantId: products.variant_id,
          quantity: products.quantity,
          price:  products.list_price,
          cartID: checkoutID.get()
        })
      }
      await fetch(url, options);
    } catch (error) {
      console.log('error'+ error);
    }
  }
  
return 1;  
}
export interface RedeemableFormValues {
  redeemableCode: string;
  coupons?: Coupon[];
  giftCertificates?: GiftCertificate[];
  discountAmount?: number;
  onRemovedGiftCertificate?(code: string): void;
}

export type ReedemableChildrenProps = Pick<
  RedeemableProps,
  | 'onRemovedGiftCertificate'
  | 'isRemovingGiftCertificate'
  | 'isRemovingCoupon'
  | 'coupons'
  | 'giftCertificates'
>;

export type RedeemableProps = {
  appliedRedeemableError?: RequestError;
  isApplyingRedeemable?: boolean;
  isRemovingRedeemable?: boolean;
  removedRedeemableError?: RequestError;
  showAppliedRedeemables?: boolean;
  shouldCollapseCouponCode?: boolean;
  applyCoupon(code: string): Promise<CheckoutSelectors>;
  applyGiftCertificate(code: string): Promise<CheckoutSelectors>;
  clearError(error: Error): void;
} & AppliedRedeemablesProps;

const Redeemable: FunctionComponent<
  RedeemableProps & WithLanguageProps & FormikProps<RedeemableFormValues>
> = ({ shouldCollapseCouponCode, showAppliedRedeemables, ...formProps }) => (
  <Toggle openByDefault={ !shouldCollapseCouponCode }>
    { ({ toggle, isOpen }) => (
      <Fragment>
        { shouldCollapseCouponCode && (
          <a
              className="redeemable-label hiddenLabel"
              data-test="redeemable-label"
              href="#"
              onClick={ preventDefault(toggle) }
          >
            <TranslatedString id="redeemable.toggle_action" />
          </a>
        ) }
        { (isOpen || !shouldCollapseCouponCode) && (
          <div data-test="redeemable-collapsable">
            <RedeemableForm { ...formProps } />
            { /* showAppliedRedeemables && <AppliedRedeemables { ...formProps } /> */ }
          </div>
        ) }
      </Fragment>
    ) }
  </Toggle>
);

const RedeemableForm: FunctionComponent<
  Partial<RedeemableProps> &
    FormikProps<RedeemableFormValues> &
    WithLanguageProps
> = ({
  appliedRedeemableError,
  isApplyingRedeemable,
  clearError = noop,
  submitForm,
  language,
  coupons,
  onRemovedCoupon,
  giftCertificates,
  onRemovedGiftCertificate,
}) => {
  const handleKeyDown = useCallback(
    memoizeOne(
      (setSubmitted: FormContextType['setSubmitted']) =>
        (event: KeyboardEvent) => {
          if (appliedRedeemableError) {
            clearError(appliedRedeemableError);
          }

          // note: to prevent submitting main form, we manually intercept
          // the enter key event and submit the "subform".
          if (event.keyCode === 13) {
            setSubmitted(true);
            submitForm();
            event.preventDefault();
          }
        }
    ),
    [appliedRedeemableError, clearError, submitForm]
  );

  const handleSubmit = useCallback(
    memoizeOne((setSubmitted: FormContextType['setSubmitted']) => () => {
      setSubmitted(true);
      submitForm();
    }),
    []
  );

  const renderLabel = useCallback(
    (name: string) => (
      <Label hidden htmlFor={ name }>
        <TranslatedString id="redeemable.code_label" />
      </Label>
    ),
    []
  );

  const renderErrorMessage = useCallback((errorCode: string) => {
    switch (errorCode) {
      case 'min_purchase':
        return <TranslatedString id="redeemable.coupon_min_order_total" />;
      case 'not_applicable':
        return <TranslatedString id="redeemable.coupon_location_error" />;
      default:
        return <TranslatedString id="redeemable.code_invalid_error" />;
    }
  }, []);

  const renderInput = useCallback(
    (setSubmitted: FormContextType['setSubmitted']) =>
      ({ field }: FieldProps) =>
        (
          <Fragment>
            <Fragment>
              {
                <div
                    className={
                    'redeemable-label ' +
                    (appliedRedeemableError?.errors?.[0] ? 'error' : null)
                  }
                >
                  <TranslatedString id="redeemable.toggle_action" />
                </div>
              }
            </Fragment>

            <div
                className={
                'form-prefixPostfix coupon-input ' +
                (appliedRedeemableError &&
                appliedRedeemableError.errors &&
                appliedRedeemableError.errors[0]
                  ? 'erroredInput'
                  : 'noErrors')
              }
            >
              <TextInput
                  { ...field }
                  aria-label={ language.translate('redeemable.code_label') }
                  className="form-input optimizedCheckout-form-input"
                  onKeyDown={ handleKeyDown(setSubmitted) }
                  testId="redeemableEntry-input"
              />

              <Button
                  className="form-prefixPostfix-button--postfix testing-random-123"
                  id="applyRedeemableButton"
                  isLoading={ isApplyingRedeemable }
                  onClick={ handleSubmit(setSubmitted) }
                  testId="redeemableEntry-submit"
                  variant={ ButtonVariant.Primary }
              >
                <TranslatedString id="redeemable.apply_action" />
              </Button>
            </div>

            { appliedRedeemableError &&
              appliedRedeemableError.errors &&
              appliedRedeemableError.errors[0] && (
                <span className="couponErrors">
                  <Alert type={ AlertType.Error }>
                    { renderErrorMessage(appliedRedeemableError.errors[0].code) }
                  </Alert>
                </span>
              ) }

            <span data-error-section="promo-error" className="couponError">
              <div className="alertBox alertBox--error">
                <div aria-live="assertive" className="alertBox-column alertBox-message" role="alert">
                  This coupon cannot be combined with the current pack 3 for $48 discount.
                </div>
              </div>
            </span>

            <div className="couponContainer">
              { coupons?.length ? (
                <p className="couponHeading">Code Applied</p>
              ) : (
                <></>
              ) }

              { (coupons || []).map((coupon, index) =>
                <OrderSummaryDiscount
                    amount={ coupon.discountedAmount }
                    code={ coupon.code }
                    key={ index }
                    onRemoved={ onRemovedCoupon }
                    testId="cart-coupon"
                />
              ) }

              { (giftCertificates || []).map((giftCertificate, index) => (
                <OrderSummaryDiscount
                    amount={ giftCertificate.used }
                    code={ giftCertificate.code }
                    key={ index }
                    onRemoved={ onRemovedGiftCertificate }
                    remaining={ giftCertificate.remaining }
                    testId="cart-gift-certificate"
                />
              )) }
            </div>
          </Fragment>
        ),
    [appliedRedeemableError, coupons, giftCertificates, handleKeyDown, handleSubmit, isApplyingRedeemable, language, onRemovedCoupon, onRemovedGiftCertificate, renderErrorMessage]
  );

  const renderContent = useCallback(
    memoizeOne(({ setSubmitted }: FormContextType) => (
      <FormField
          input={ renderInput(setSubmitted) }
          label={ renderLabel }
          name="redeemableCode"
      />
    )),
    [renderLabel, renderInput]
  );

  return (
    <fieldset className="form-fieldset redeemable-entry">
      <FormProvider>{ renderContent }</FormProvider>
    </fieldset>
  );
};

export default withLanguage(
  withFormik<RedeemableProps & WithLanguageProps, RedeemableFormValues>({
    mapPropsToValues() {
      return {
        redeemableCode: '',
      };
    },

    async handleSubmit(
      { redeemableCode },
      { props: { applyCoupon, applyGiftCertificate, clearError } }
    ) {
      const code = redeemableCode.trim();
      let couponDiscountAmt = 0;
      let couponData = {
        stackCoupon: false,
        rejectCoupon: false,
        rejectCouponIfDiscountIsLess: false
      };
      // const couponData = await getCouponData(code);
      

      const allPromise = Promise.all([getCouponData(code), getCouponInfo(code)]);
      try {
        const values = await allPromise;
        couponDiscountAmt = values[1] ? values[1] : couponDiscountAmt;
        couponData = values[0] ? values[0] : couponData;
      } catch (error) {
        console.log("Promise rejectReason", error);
      }

      // allPromise.then(values => {
      //   console.log("pppppppp---=======--22", values);
      //   couponDiscountAmt = values[1] ? values[1] : couponDiscountAmt;
      //   couponData = values[0] ? values[0] : couponData;

      //   values; // [valueOfPromise1, valueOfPromise2, ...]
      // }).catch(error => {
        
      // });


      console.log(couponDiscountAmt, "pppppppp22", couponData)
      
      // let couponDiscountAmt = await getCouponInfo(code);
      let threefor48Discount = get3For48DiscountTotal(productsApplicableFor3For48Promo.get());
      console.log(couponDiscountAmt, "++cod9e--0-",is3For48PromoActive.get());
      try {
        await applyGiftCertificate(code);
      } catch (error) {
        console.log(is3For48PromoActive.get(), "Don't apply coupon-+", couponDiscountAmt);
        // clearError(error);
        if(couponDiscountAmt && is3For48PromoActive.get()) {
          console.log("Don3't appl--y cou", threefor48Discount);
          if(couponDiscountAmt > 0 && couponData.stackCoupon) {
            clearError(error);
            console.log("Don'ly cou0");
            // await updateCartWithOriginalProducts(productsApplicableFor3For48Promo.get());
            applyCoupon(code);
            // displayPromoError();
            displayPromoError(false);
          } else if(couponDiscountAmt >= threefor48Discount && couponData.rejectCoupon) {
            clearError(error);
            console.log("Don'ly cou");
            await updateCartWithOriginalProducts(productsApplicableFor3For48Promo.get());
            displayPromoError(true);
            removeAppliedCoupon(code);
          } else if(couponDiscountAmt < threefor48Discount && couponData.rejectCouponIfDiscountIsLess) {
            console.log("Don'ly cou111");
            clearError(error);
            displayPromoError(true);
            removeAppliedCoupon(code);
          } else if(couponDiscountAmt > threefor48Discount && couponData.rejectCouponIfDiscountIsLess) {
            console.log("H====eeee---ee");
            applyCoupon(code);
            // displayPromoError();
            displayPromoError(false);
            clearError(error);
          }
        } else {
          console.log("Don'ly cou11122");
          // console.log("Don't apply");
          clearError(error);
          applyCoupon(code);
        }
        
       
        // if(is3For48PromoActive.get()) {
        //   if(couponDiscountAmt >= threefor48Discount) {
        //     clearError(error);
        //     await updateCartWithOriginalProducts(productsApplicableFor3For48Promo.get());
            
        //     applyCoupon(code);
        //     // window.location.reload();
        //   } else {
        //     console.log("error===",error);
        //     removeAppliedCoupon(code);
        //     // console.log("Don't apply coupon-", is3For48PromoActive.get())
        //   }
        // } else {
        //   clearError(error);
        //   applyCoupon(code);
        // }
      }
    },

    validationSchema({ language }: RedeemableProps & WithLanguageProps) {
      return object({
        redeemableCode: string().required(
          language.translate('redeemable.code_required_error')
        ),
      });
    },
  })(memo(Redeemable))
);
