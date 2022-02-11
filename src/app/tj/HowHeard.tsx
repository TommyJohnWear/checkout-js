import { Order } from '@bigcommerce/checkout-sdk';
import React, { useEffect, useState, FunctionComponent } from 'react';

const optionsGroups = [
  { name: 'Radio', options: [
    {name: 'Mike & Mike', value: 'Mike & Mike'},
    { name: 'Howard Stern', value: 'Howard Stern' },
    { name: 'Colin Cowherd', value: 'Colin Cowherd' },
    { name: 'Adam Carolla', value: 'Adam Carolla' },
    { name: 'CNN Radio', value: 'CNN Radio' },
    { name: 'Sirius XM', value: 'Sirius XM' },
    { name: 'Z100', value: 'Z100' },
  ] },
  { name: 'Social', options: [
    { name: 'Pinterest', value: 'Pinterest' },
    { name: 'Facebook', value: 'Facebook' },
    { name: 'Instagram', value: 'Instagram' },
    { name: 'YouTube', value: 'YouTube' },
  ] },
  { name: 'Print', options: [
    { name: 'Tommy John Catalog' },
    { name: 'Delta Sky Magazine' },
    { name: 'Golf Digest', value: 'Golf Digest' },
  ] },
];
interface HowHeardProps {
  order: Order;
}

export const HowHeard: FunctionComponent<HowHeardProps> = ({ order }) => {
  const [selected, setSelected] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dateFormat =  new Intl.DateTimeFormat('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    /* const lastSelected = localStorage?.getItem('selectHowHeard');
    lastSelected ? setSelected(lastSelected) : setSelected(''); */
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    localStorage.setItem('selectHowHeard', val);
    setSelected(val);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await fetch('https://56bfdc2e7a2cbe18178a2c1a1d7cce00.m.pipedream.net',  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            selected,
            orderId: order.orderId,
            date: dateFormat.format(new Date()),
        }),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return isSubmitted ? (
    <p className="how-heard-submitted-text">Thank you for your submission.</p>
  ) : (
    <form id="how-heard" onSubmit={ handleSubmit }>
      <h3 className="title">
        Before you go &mdash;
        <span className="line">how did you hear about Tommy John?</span>
      </h3>

      <div className="field-wrapper">
        <select className="select" name="orderComment" onChange={ handleChange } value ={ selected }>
          <option disabled hidden value="">Source</option>
          { optionsGroups.map(({ name: groupName, options }) => (
            <optgroup key={ groupName } label={ groupName }>
              { options.map(({ name, value }) => (
                <option key={ value } value={ value }>{ name }</option>
              )) }
            </optgroup>
          )) }
        </select>

        <button className="submit" disabled={ !selected }>Submit</button>
      </div>
    </form>
  );
};
