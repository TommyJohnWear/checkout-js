import { Order } from '@bigcommerce/checkout-sdk';
import React, { useEffect, useState, FunctionComponent } from 'react';

const options = [
  { name: 'Already a Customer', value: 'Already a Customer' },
  { name: 'Ashley Tisdale', value: 'Ashley Tisdale' },
  { name: 'Catalog \/ Mailer', value: 'Catalog \/ Mailer' },
  { name: 'CBS The Talk', value: 'CBS The Talk' },
  { name: 'Clay Travis & Buck Sexton', value: 'Clay Travis & Buck Sexton' },
  { name: 'Facebook Ad', value: 'Facebook Ad' },
  { name: 'Friends or Family Member', value: 'Friends or Family Member' },
  { name: 'Hulu', value: 'Hulu' },
  { name: 'Instagram Influencer', value: 'Instagram Influencer' },
  { name: 'Jenna Dewan', value: 'Jenna Dewan' },
  { name: 'Magazine \/ Newspaper', value: 'Magazine \/ Newspaper' },
  { name: "Men's Wearhouse", value: "Men's Wearhouse" },
  { name: 'Nordstrom', value: 'Nordstrom' },
  { name: 'Online Search', value: 'Online Search' },
  { name: 'Other', value: 'Other' },
  { name: 'Other Department Store', value: 'Other Department Store' },
  { name: 'Podcast', value: 'Podcast' },
  { name: 'QVC', value: 'QVC' },
  { name: 'Radio', value: 'Radio' },
  { name: 'Received as Gift', value: 'Received as Gift' },
  { name: 'Social Media', value: 'Social Media' },
  { name: 'Specialty Store', value: 'Specialty Store' },
  { name: 'Today Show', value: 'Today Show' },
  { name: 'Tommy John Online', value: 'Tommy John Online' },
  { name: 'TV Ad', value: 'TV Ad' },
  { name: 'YouTube', value: 'YouTube' },
  { name: 'YouTube Influencer', value: 'YouTube Influencer' },
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
    const lastSelected = localStorage?.getItem('selectHowHeard');
    lastSelected ? setSelected(lastSelected) : setSelected('');
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
          { options.map(({ name, value }) => <option key={ value } value={ value }>{ name }</option>) }
        </select>

        <button className="submit">Submit</button>
      </div>
    </form>
  );
};
