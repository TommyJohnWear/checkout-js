import { Address, Cart, CartChangedError, CheckoutParams, CheckoutSelectors, Consignment, CustomerInitializeOptions, CustomerRequestOptions, EmbeddedCheckoutMessenger, EmbeddedCheckoutMessengerOptions, FlashMessage, Promotion, RequestOptions, StepTracker } from '@bigcommerce/checkout-sdk';
import classNames from 'classnames';
import { find, findIndex } from 'lodash';
import React, { lazy, Component, ReactNode } from 'react';

import { StaticBillingAddress } from '../billing';
import { EmptyCartMessage } from '../cart';
import { isCustomError, CustomError, ErrorLogger, ErrorModal } from '../common/error';
import { retry } from '../common/utility';
import { CheckoutSuggestion, CustomerInfo, CustomerSignOutEvent, CustomerViewType } from '../customer';
import CheckoutButtonList from '../customer/CheckoutButtonList';
import { isEmbedded, EmbeddedCheckoutStylesheet } from '../embeddedCheckout';
import { withLanguage, TranslatedString, WithLanguageProps } from '../locale';
import { PromotionBannerList } from '../promotion';
import { hasSelectedShippingOptions, isUsingMultiShipping, StaticConsignment } from '../shipping';
import { ShippingOptionExpiredError } from '../shipping/shippingOption';
import { LazyContainer, LoadingNotification, LoadingOverlay } from '../ui/loading';
import { MobileView } from '../ui/responsive';

import mapToCheckoutProps from './mapToCheckoutProps';
import navigateToOrderConfirmation from './navigateToOrderConfirmation';
import withCheckout from './withCheckout';
import CheckoutStep from './CheckoutStep';
import CheckoutStepStatus from './CheckoutStepStatus';
import CheckoutStepType from './CheckoutStepType';
import CheckoutSupport from './CheckoutSupport';
import { checkoutID, checkoutProductID, sanityData, checkoutProductInformation, productsApplicableFor3For48Promo } from '../../store';
import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'tw5gcwis',
  dataset: 'beta',
  useCdn: false,
  apiVersion: 'v2021-07-26',
});

const Billing = lazy(() => retry(() => import(
    /* webpackChunkName: "billing" */
    '../billing/Billing'
)));

const CartSummary = lazy(() => retry(() => import(
    /* webpackChunkName: "cart-summary" */
    '../cart/CartSummary'
)));

const CartSummaryDrawer = lazy(() => retry(() => import(
    /* webpackChunkName: "cart-summary-drawer" */
    '../cart/CartSummaryDrawer'
)));

const Customer = lazy(() => retry(() => import(
    /* webpackChunkName: "customer" */
    '../customer/Customer'
)));

const Payment = lazy(() => retry(() => import(
    /* webpackChunkName: "payment" */
    '../payment/Payment'
)));

const Shipping = lazy(() => retry(() => import(
    /* webpackChunkName: "shipping" */
    '../shipping/Shipping'
)));

const parseCartProducts = (cart: any) => {
    let cartProductInfo = [];
    console.log("ca9999+", cart)
    if(cart && cart.lineItems && cart.lineItems.physicalItems) {
        cartProductInfo = cart.lineItems.physicalItems.map((p: any) => ({
            productId: p.productId,
            variantId: p.variantId,
            quantity: p.quantity,
            itemId: p.id,
            // listPrice: 10
        }));
    }
    return cartProductInfo;
}

// const getSetSanityData = async (productIDs: any) => {
//     productIDs = productIDs.map((item: any) => `${item}`);
//     const query = `*[ _type == "Product" && productId in ${JSON.stringify(productIDs)} ]{ productId, isThreeforFortyEightEligible }`;
//     client.fetch(query)
//         .then(data => {
//                 // init(data[0].shippingTier);
//             console.log(data,"------0-0-=====",/* checkoutID.get() */);
//             return data;
//         })
//     .catch(error => console.log('Something went wrong fetching data from sanity: ', error));
// }

const getCurrentCartProductInfo = async (productIDs: number[], variantIDs: number[]) => {
    const url = `/graphql`;
    const query = `
    query imagesForProducts (
      $productIds: [Int!],
      $variantIds: [Int!],
    ) {
      site {
        products(entityIds: $productIds) {
          edges {
            node {
              entityId
              path
              variants(entityIds: $variantIds) {
                edges {
                  node {
                    entityId
                    prices {
                        price {
                          ...MoneyFields
                        }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    fragment MoneyFields on Money {
        value
        currencyCode
    }
    `

    let variables = {
        productIds: productIDs,
        variantIds: variantIDs,
      }

    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cHM6Ly9jaGVja291dC50b21teWpvaG4uaW8iXSwiZWF0IjoxNzAzOTMzODM2LCJpYXQiOjE2NDkxNjQ3MzYsImlzcyI6IkJDIiwic2lkIjoxMDAxOTQ5NTIzLCJzdWIiOiJmMXh4ZHduMGF1cGV2ZzNpajZpOTJhd3JzdGNpY205Iiwic3ViX3R5cGUiOjIsInRva2VuX3R5cGUiOjF9.OaE5DmlEwF2ir3-A6_DevhjicSinIWuU2QZZFMIUCXFSXWWThLuZVAyBjG_IflHh6qzHU_6AKh7ebk5tGMje8Q`,
        },
        body: JSON.stringify({ query, variables }),
      };
  
      try {
        const res = await fetch(url, options);
        let { data } = await res.json();
        data = data.site.products.edges.flatMap(({ node: product = {} }:any) => {
            const { entityId: productId } = product;
            return product.variants.edges.map(({ node: variant = {} }: any) => ({
              productId,
              variantId: variant.entityId,
              price: variant.prices.price.value,
            }));
          })
        return data;
      } catch (err) {
        console.log("Error while fetching data from BigC", err);
        return [];
      }
}


const getProductsApplicableFor3For48 = (sanityData: any, cartProductInfo: any, parsedCartProductInfo: any) => {
    console.log("getProductsApplicableFor3For48-", sanityData, cartProductInfo, parsedCartProductInfo);
    sanityData = sanityData.filter((d: any) => d.isThreeforFortyEightEligible);
    parsedCartProductInfo = parsedCartProductInfo.map((lineItem: any) => {
        let productsWithSameId = parsedCartProductInfo.filter((p: any) => p.productId == lineItem.productId);
        let totalQty = 0;
        productsWithSameId.forEach((element: any) => {
            totalQty += element.quantity;
        });
        console.log(lineItem.productId, "totalQty==",totalQty);
        totalQty >= 3 ? lineItem.isApplicableFor3for48 = true : lineItem.isApplicableFor3for48 = false;
        return lineItem;
    });

    let productsApplicableFor3For48 = parsedCartProductInfo.filter((o1: any) => sanityData.some((o2: any) => o1.productId === +o2.productId && o1.isApplicableFor3for48));

    productsApplicableFor3For48.map((item: any)=> {
        let data = cartProductInfo.filter((d:any) => d.productId == item.productId && item.variantId == d.variantId);
        item.price = data[0].price
        return item
    });

    console.log("parsedCartProductInfo==",productsApplicableFor3For48);
    return productsApplicableFor3For48

}

export interface CheckoutProps {
    checkoutId: string;
    containerId: string;
    embeddedStylesheet: EmbeddedCheckoutStylesheet;
    embeddedSupport: CheckoutSupport;
    errorLogger: ErrorLogger;
    createEmbeddedMessenger(options: EmbeddedCheckoutMessengerOptions): EmbeddedCheckoutMessenger;
    createStepTracker(): StepTracker;
}

export interface CheckoutState {
    activeStepType?: CheckoutStepType;
    isBillingSameAsShipping: boolean;
    customerViewType?: CustomerViewType;
    defaultStepType?: CheckoutStepType;
    error?: Error;
    flashMessages?: FlashMessage[];
    isMultiShippingMode: boolean;
    isCartEmpty: boolean;
    isRedirecting: boolean;
    hasSelectedShippingOptions: boolean;
}

export interface WithCheckoutProps {
    billingAddress?: Address;
    cart?: Cart;
    checkoutButtonIds: string[];
    consignments?: Consignment[];
    error?: Error;
    hasCartChanged: boolean;
    flashMessages?: FlashMessage[];
    isGuestEnabled: boolean;
    isLoadingCheckout: boolean;
    isPending: boolean;
    loginUrl: string;
    createAccountUrl: string;
    canCreateAccountInCheckout: boolean;
    promotions?: Promotion[];
    steps: CheckoutStepStatus[];
    isInitializing: boolean;
    clearError(error?: Error): void;
    loadCheckout(id: string, options?: RequestOptions<CheckoutParams>): Promise<CheckoutSelectors>;
    subscribeToConsignments(subscriber: (state: CheckoutSelectors) => void): () => void;
    deinitializeCustomer(options: CustomerRequestOptions): Promise<CheckoutSelectors>;
    initializeCustomer(options: CustomerInitializeOptions): Promise<CheckoutSelectors>;
}

class Checkout extends Component<CheckoutProps & WithCheckoutProps & WithLanguageProps, CheckoutState> {
    stepTracker: StepTracker | undefined;

    state: CheckoutState = {
        isBillingSameAsShipping: true,
        isCartEmpty: false,
        isRedirecting: false,
        isMultiShippingMode: false,
        hasSelectedShippingOptions: false,
    };

    private embeddedMessenger?: EmbeddedCheckoutMessenger;
    private unsubscribeFromConsignments?: () => void;

    componentWillUnmount(): void {
        if (this.unsubscribeFromConsignments) {
            this.unsubscribeFromConsignments();
            this.unsubscribeFromConsignments = undefined;
        }
    }

    async componentDidMount(): Promise<void> {
        const {
            checkoutId,
            containerId,
            createStepTracker,
            createEmbeddedMessenger,
            embeddedStylesheet,
            loadCheckout,
            subscribeToConsignments,
        } = this.props;
        checkoutID.set(checkoutId);

        try {
            const { data } = await loadCheckout(checkoutId, {
                params: {
                    include: [
                        'cart.lineItems.physicalItems.categoryNames',
                        'cart.lineItems.digitalItems.categoryNames',
                    ] as any, // FIXME: Currently the enum is not exported so it can't be used here.
                },
            });

            const parsedCartProductInfo = parseCartProducts(data.getCart());
            const cartProductIDs = parsedCartProductInfo.map((item: any) => `${item.productId}`);
            const cartVariantIDs = parsedCartProductInfo.map((item: any) => item.variantId);
            const cartBigCProductIDs = parsedCartProductInfo.map((item: any) => item.productId);
            // console.log("parsedCartProductInfo==",cartVariantIDs);
            let cartProductInfo = await getCurrentCartProductInfo(cartBigCProductIDs, cartVariantIDs);
            checkoutProductID.set(cartProductIDs);
            checkoutProductInformation.set(parsedCartProductInfo);
            // getSanityData(cartProductIDs);
            console.log("===cartProductIDs=!!!!=",cartProductInfo);


    //     let ui = 'http://localhost:8888/api/update-users-cart';
        
    //    await fetch(
    //         ui,
    //         {
    //             method: "GET",
    //             headers: {
    //               "Content-Type": "application/json",
    //             },
    //           }
    //       ).then(data => {
    //         // init(data[0].shippingTier);
    //     console.log(data,"------0-0-=====",/* checkoutID.get() */);
    //     // sanityData.set(data);
    //     // return data;
    // })



            // cartProductIDs = cartProductIDs.map((item: any) => `${item}`);
            const query = `*[ _type == "Product" && productId in ${JSON.stringify(cartProductIDs)} ]{ productId, isThreeforFortyEightEligible }`;
            client.fetch(query)
                .then(data => {
                    let dummyData = [
                        {
                            "isThreeforFortyEightEligible": true,
                            "productId": "2147"
                        },
                        {
                            "isThreeforFortyEightEligible": true,
                            "productId": "2149"
                        },
                        {
                            "isThreeforFortyEightEligible": true,
                            "productId": "2151"
                        }
                    ]
                        // init(data[0].shippingTier);
                    data.push(dummyData)
                        // init(data[0].shippingTier);
                    console.log(data,"------0Jubin-0-=====",/* checkoutID.get() */);
                    sanityData.set(data);
                    let productsApplicableFor3For48 = getProductsApplicableFor3For48(data[0], cartProductInfo, parsedCartProductInfo);
                    productsApplicableFor3For48Promo.set(productsApplicableFor3For48);

                    return data;
                })
            .catch(error => console.log('Something went wrong fetching data from sanity: ', error));

            const { links: { siteLink = '' } = {} } = data.getConfig() || {};
            const errorFlashMessages = data.getFlashMessages('error') || [];

            if (errorFlashMessages.length) {
                const { language } = this.props;

                this.setState({
                    error: new CustomError({
                        title: errorFlashMessages[0].title || language.translate('common.error_heading'),
                        message: errorFlashMessages[0].message,
                        data: {},
                        name: 'default',
                    }),
                });
            }

            const messenger = createEmbeddedMessenger({ parentOrigin: siteLink });

            this.unsubscribeFromConsignments = subscribeToConsignments(this.handleConsignmentsUpdated);
            this.embeddedMessenger = messenger;
            messenger.receiveStyles(styles => embeddedStylesheet.append(styles));
            messenger.postFrameLoaded({ contentId: containerId });
            messenger.postLoaded();

            this.stepTracker = createStepTracker();
            this.stepTracker.trackCheckoutStarted();

            const consignments = data.getConsignments();
            const cart = data.getCart();
            const hasMultiShippingEnabled = data.getConfig()?.checkoutSettings?.hasMultiShippingEnabled;
            const isMultiShippingMode = !!cart &&
                !!consignments &&
                hasMultiShippingEnabled &&
                isUsingMultiShipping(consignments, cart.lineItems);

            if (isMultiShippingMode) {
                this.setState({ isMultiShippingMode }, this.handleReady);
            } else {
                this.handleReady();
            }
        } catch (error) {
            this.handleUnhandledError(error);
        }
    }

    render(): ReactNode {
        const { error } = this.state;
        let errorModal = null;

        (window as any).utag_data.page_name = 'checkout';

        if (error) {
            if (isCustomError(error)) {
                errorModal = <ErrorModal error={ error } onClose={ this.handleCloseErrorModal } title={ error.title } />;
            } else {
                errorModal = <ErrorModal error={ error } onClose={ this.handleCloseErrorModal } />;
            }
        }

        return <>
            <div className={ classNames({ 'is-embedded': isEmbedded() }) }>
                <div className="layout optimizedCheckout-contentPrimary">
                    { this.renderContent() }
                </div>
                { errorModal }
            </div>

        </>;
    }

    private renderContent(): ReactNode {
        const {
            checkoutButtonIds,
            isPending,
            loginUrl,
            promotions = [],
            steps,
            deinitializeCustomer,
            initializeCustomer,
            isInitializing,
        } = this.props;

        const {
            activeStepType,
            defaultStepType,
            isCartEmpty,
            isRedirecting,
        } = this.state;

        if (isCartEmpty) {
            return (
                <EmptyCartMessage
                    loginUrl={ loginUrl }
                    waitInterval={ 3000 }
                />
            );
        }

        return (
            <LoadingOverlay
                hideContentWhenLoading
                isLoading={ isRedirecting }
            >
                <div className="layout-main">
                    <LoadingNotification isLoading={ isPending } />

                    <PromotionBannerList promotions={ promotions } />

                    <CheckoutButtonList
                        checkEmbeddedSupport={ this.checkEmbeddedSupport }
                        deinitialize={ deinitializeCustomer }
                        initialize={ initializeCustomer }
                        isInitializing={ isInitializing }
                        methodIds={ checkoutButtonIds }
                        onError={ this.handleUnhandledError }
                    />

                    <ol className="checkout-steps">
                        { steps
                            .filter(step => step.isRequired)
                            .map(step => this.renderStep({
                                ...step,
                                isActive: activeStepType ? activeStepType === step.type : defaultStepType === step.type,
                            })) }
                    </ol>
                </div>

                { this.renderCartSummary() }
            </LoadingOverlay>
        );
    }

    private renderStep(step: CheckoutStepStatus): ReactNode {
        switch (step.type) {
        case CheckoutStepType.Customer:
            return this.renderCustomerStep(step);

        case CheckoutStepType.Shipping:
            return this.renderShippingStep(step);

        case CheckoutStepType.Billing:
            return this.renderBillingStep(step);

        case CheckoutStepType.Payment:
            return this.renderPaymentStep(step);

        default:
            return null;
        }
    }

    private renderCustomerStep(step: CheckoutStepStatus): ReactNode {
        const { isGuestEnabled } = this.props;

        const {
            customerViewType = isGuestEnabled ? CustomerViewType.Guest : CustomerViewType.Login,
        } = this.state;

        return (
            <CheckoutStep
                { ...step }
                heading={ <TranslatedString id="customer.customer_heading" /> }
                key={ step.type }
                onEdit={ this.handleEditStep }
                onExpanded={ this.handleExpanded }
                suggestion={ <CheckoutSuggestion /> }
                summary={
                    <CustomerInfo
                        onSignOut={ this.handleSignOut }
                        onSignOutError={ this.handleError }
                    />
                }
            >
                <LazyContainer>
                    <Customer
                        checkEmbeddedSupport={ this.checkEmbeddedSupport }
                        isEmbedded={ isEmbedded() }
                        onAccountCreated={ this.navigateToNextIncompleteStep }
                        onChangeViewType={ this.setCustomerViewType }
                        onContinueAsGuest={ this.navigateToNextIncompleteStep }
                        onContinueAsGuestError={ this.handleError }
                        onReady={ this.handleReady }
                        onSignIn={ this.navigateToNextIncompleteStep }
                        onSignInError={ this.handleError }
                        onUnhandledError={ this.handleUnhandledError }
                        viewType={ customerViewType }
                    />
                </LazyContainer>
            </CheckoutStep>
        );
    }

    private renderShippingStep(step: CheckoutStepStatus): ReactNode {
        const {
            hasCartChanged,
            cart,
            consignments = [],
        } = this.props;

        const {
            isBillingSameAsShipping,
            isMultiShippingMode,
        } = this.state;

        if (!cart) {
            return;
        }

        return (
            <CheckoutStep
                { ...step }
                heading={ <TranslatedString id="shipping.shipping_heading" /> }
                key={ step.type }
                onEdit={ this.handleEditStep }
                onExpanded={ this.handleExpanded }
                summary={ consignments.map(consignment =>
                    <div className="staticConsignmentContainer" key={ consignment.id }>
                        <StaticConsignment
                            cart={ cart }
                            compactView={ consignments.length < 2 }
                            consignment={ consignment }
                        />
                    </div>) }
            >
                <LazyContainer>
                    <Shipping
                        cartHasChanged={ hasCartChanged }
                        isBillingSameAsShipping={ isBillingSameAsShipping }
                        isMultiShippingMode={ isMultiShippingMode }
                        navigateNextStep={ this.handleShippingNextStep }
                        onCreateAccount={ this.handleShippingCreateAccount }
                        onReady={ this.handleReady }
                        onSignIn={ this.handleShippingSignIn }
                        onToggleMultiShipping={ this.handleToggleMultiShipping }
                        onUnhandledError={ this.handleUnhandledError }
                    />
                </LazyContainer>
            </CheckoutStep>
        );
    }

    private renderBillingStep(step: CheckoutStepStatus): ReactNode {
        const { billingAddress } = this.props;

        return (
            <CheckoutStep
                { ...step }
                heading={ <TranslatedString id="billing.billing_heading" /> }
                key={ step.type }
                onEdit={ this.handleEditStep }
                onExpanded={ this.handleExpanded }
                summary={ billingAddress && <StaticBillingAddress address={ billingAddress } /> }
            >
                <LazyContainer>
                    <Billing
                        navigateNextStep={ this.navigateToNextIncompleteStep }
                        onReady={ this.handleReady }
                        onUnhandledError={ this.handleUnhandledError }
                    />
                </LazyContainer>
            </CheckoutStep>
        );
    }

    private renderPaymentStep(step: CheckoutStepStatus): ReactNode {
        const {
            consignments,
            cart,
        } = this.props;

        return (
            <CheckoutStep
                { ...step }
                heading={ <TranslatedString id="payment.payment_heading" /> }
                key={ step.type }
                onEdit={ this.handleEditStep }
                onExpanded={ this.handleExpanded }
            >
                <LazyContainer>
                    <Payment
                        checkEmbeddedSupport={ this.checkEmbeddedSupport }
                        isEmbedded={ isEmbedded() }
                        isUsingMultiShipping={ cart && consignments ? isUsingMultiShipping(consignments, cart.lineItems) : false }
                        onCartChangedError={ this.handleCartChangedError }
                        onFinalize={ this.navigateToOrderConfirmation }
                        onReady={ this.handleReady }
                        onSubmit={ this.navigateToOrderConfirmation }
                        onSubmitError={ this.handleError }
                        onUnhandledError={ this.handleUnhandledError }
                    />
                </LazyContainer>
            </CheckoutStep>
        );
    }

    private renderCartSummary(): ReactNode {
        return (
            <MobileView>
                { matched => {
                    if (matched) {
                        return <LazyContainer>
                            <CartSummaryDrawer />
                        </LazyContainer>;
                    }

                    return <aside className="layout-cart">
                        <LazyContainer>
                            <CartSummary />
                        </LazyContainer>
                    </aside>;
                } }
            </MobileView>
        );
    }

    private navigateToStep(type: CheckoutStepType, options?: { isDefault?: boolean }): void {
        const { clearError, error, steps } = this.props;
        const { activeStepType } = this.state;
        const step = find(steps, { type });

        if (!step) {
            return;
        }

        if (activeStepType === step.type) {
            return;
        }

        if (options && options.isDefault) {
            this.setState({ defaultStepType: step.type });
        } else {
            this.setState({ activeStepType: step.type });
        }

        if (error) {
            clearError(error);
        }
    }

    private handleToggleMultiShipping: () => void = () => {
        const { isMultiShippingMode } = this.state;

        this.setState({ isMultiShippingMode: !isMultiShippingMode });
    };

    private navigateToNextIncompleteStep: (options?: { isDefault?: boolean }) => void = options => {
        (window as any).utag_data.customer_logged_in = 'false';
        const { steps } = this.props;
        const activeStepIndex = findIndex(steps, { isActive: true });
        const activeStep = activeStepIndex >= 0 && steps[activeStepIndex];

        if (!activeStep) {
            return;
        }

        const previousStep = steps[Math.max(activeStepIndex - 1, 0)];

        if (previousStep && this.stepTracker) {
            this.stepTracker.trackStepCompleted(previousStep.type);
        }

        this.navigateToStep(activeStep.type, options);
    };

    private navigateToOrderConfirmation: () => void = () => {
        const { steps } = this.props;

        if (this.stepTracker) {
            this.stepTracker.trackStepCompleted(steps[steps.length - 1].type);
        }

        if (this.embeddedMessenger) {
            this.embeddedMessenger.postComplete();
        }

        this.setState({ isRedirecting: true }, () => {
            navigateToOrderConfirmation();
        });
    };

    private checkEmbeddedSupport: (methodIds: string[]) => boolean = methodIds => {
        const { embeddedSupport } = this.props;

        return embeddedSupport.isSupported(...methodIds);
    };

    private handleCartChangedError: (error: CartChangedError) => void = () => {
        this.navigateToStep(CheckoutStepType.Shipping);
    };

    private handleConsignmentsUpdated: (state: CheckoutSelectors) => void = ({ data }) => {
        const {
            hasSelectedShippingOptions: prevHasSelectedShippingOptions,
            activeStepType,
        } = this.state;

        const { steps } = this.props;

        const newHasSelectedShippingOptions = hasSelectedShippingOptions(data.getConsignments() || []);

        if (prevHasSelectedShippingOptions &&
            !newHasSelectedShippingOptions &&
            findIndex(steps, { type: CheckoutStepType.Shipping }) < findIndex(steps, { type: activeStepType })
        ) {
            this.navigateToStep(CheckoutStepType.Shipping);
            this.setState({ error: new ShippingOptionExpiredError() });
        }

        this.setState({ hasSelectedShippingOptions: newHasSelectedShippingOptions });
    };

    private handleCloseErrorModal: () => void = () => {
        this.setState({ error: undefined });
    };

    private handleExpanded: (type: CheckoutStepType) => void = type => {
        if (this.stepTracker) {
           this.stepTracker.trackStepViewed(type);
        }
    };

    private handleUnhandledError: (error: Error) => void = error => {
        this.handleError(error);

        // For errors that are not caught and handled by child components, we
        // handle them here by displaying a generic error modal to the shopper.
        this.setState({ error });
    };

    private handleError: (error: Error) => void = error => {
        const { errorLogger } = this.props;

        errorLogger.log(error);

        if (this.embeddedMessenger) {
            this.embeddedMessenger.postError(error);
        }
    };

    private handleEditStep: (type: CheckoutStepType) => void = type => {
        this.navigateToStep(type);
    };

    private handleReady: () => void = () => {
        this.navigateToNextIncompleteStep({ isDefault: true });
    };

    private handleSignOut: (event: CustomerSignOutEvent) => void = ({ isCartEmpty }) => {
        const { loginUrl, isGuestEnabled } = this.props;

        if (this.embeddedMessenger) {
            this.embeddedMessenger.postSignedOut();
        }

        if (isGuestEnabled) {
            this.setCustomerViewType(CustomerViewType.Guest);
        }

        if (isCartEmpty) {
            this.setState({ isCartEmpty: true });

            if (!isEmbedded()) {
                return window.top.location.assign(loginUrl);
            }
        }

        this.navigateToStep(CheckoutStepType.Customer);
    };

    private handleShippingNextStep: (isBillingSameAsShipping: boolean) => void = isBillingSameAsShipping => {
        this.setState({ isBillingSameAsShipping });

        if (isBillingSameAsShipping) {
            this.navigateToNextIncompleteStep();
        } else {
            this.navigateToStep(CheckoutStepType.Billing);
        }
    };

    private handleShippingSignIn: () => void = () => {
        this.setCustomerViewType(CustomerViewType.Login);
    };

    private handleShippingCreateAccount: () => void = () => {
        this.setCustomerViewType(CustomerViewType.CreateAccount);
    };

    private setCustomerViewType: (viewType: CustomerViewType) => void = customerViewType => {
        const {
            canCreateAccountInCheckout,
            createAccountUrl,
        } = this.props;

        if (customerViewType === CustomerViewType.CreateAccount &&
            (!canCreateAccountInCheckout || isEmbedded())
        ) {
            window.top.location.replace(createAccountUrl);

            return;
        }

        this.navigateToStep(CheckoutStepType.Customer);
        this.setState({ customerViewType });
    };
}

export default withLanguage(withCheckout(mapToCheckoutProps)(Checkout));
