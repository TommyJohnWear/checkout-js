import { throttle } from 'lodash';
import React, { memo, useCallback, FunctionComponent } from 'react';

import { TranslatedString } from '../locale';
// import { IconPrint } from '../ui/icon';

export interface PrintLinkProps {
    className?: string;
}

const PRINT_MODAL_THROTTLE = 500;

const PrintLink: FunctionComponent<PrintLinkProps> = ({ className }) => {

    const handleClick = useCallback(throttle(() => {
        window.print();
    }, PRINT_MODAL_THROTTLE), []);

    if (typeof window.print !== 'function') {
        return null;
    }

    return (
        <a
            className={ className || 'cart-header-link' }
            id="cart-print-link"
            onClick={ handleClick }
        >
            { /* <IconPrint /> */ }
            { ' ' }
            <TranslatedString id="cart.print_action" />
        </a>
    );
};

export default memo(PrintLink);
