import classNames from 'classnames';
import React, { forwardRef, ReactNode, Ref } from 'react';
import { BsCheck2 } from 'react-icons/bs';

import Input, { InputProps } from './Input';
import Label from './Label';
export interface CheckboxInputProps extends InputProps {
    additionalClassName?: string;
    label: ReactNode;
    value: string;
    checked: boolean;
}

const CheckboxInput = forwardRef((
    {
        additionalClassName,
        label,
        id,
        ...rest
    }: CheckboxInputProps,
    ref: Ref<HTMLInputElement>
) => (
    <>
        <Input
            { ...rest }
            className={ classNames(
                'form-checkbox',
                'optimizedCheckout-form-checkbox',
                additionalClassName
            ) }
            id={ id }
            ref={ ref }
            type="checkbox"
        />

        <Label htmlFor={ id }>
            <BsCheck2 className="icon" />
            <span className="label-text">{ label }</span>
        </Label>
    </>
));

export default CheckboxInput;
