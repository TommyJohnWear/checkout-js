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

            <div className="couponContainer">
              { coupons?.length ? (
                <p className="couponHeading">Discount Code Applied</p>
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

      try {
        await applyGiftCertificate(code);
      } catch (error) {
        clearError(error);
        applyCoupon(code);
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
