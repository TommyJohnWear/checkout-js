import { Order } from '@bigcommerce/checkout-sdk';
import React, { useEffect, useState, FunctionComponent } from 'react';

const options = [
  'YouTube',
  'TV Ad',
  'Tommy John Online',
  'Specialty Store',
  'Social Media',
  'Received as Gift',
  'Radio',
  'Podcast',
  'Other Department Store',
  'Other',
  'Online Search',
  'Nordstrom',
  "Men's Warehouse",
  'Magazine / Newspaper',
  'Kevin Hart',
  'Howard Stern',
  'Friends or Family Member',
  'Facebook Ad',
  'Catalog / Mailer',
  'Already a Customer',
  'QVC',
  'Instagram Influencer',
  'Dr. Laura',
  'Hulu',
  'Ashley Tisdale',
  'Jenna Dewan',
  'YouTube Influencer',
  'Today Show',
  'Squawk Box',
  'Clay Travis & Buck Sexton',
  'Billboard',
];

const shuffleArray = (array: any[] = []): any[] => {
  // shallow copy array
  const newArr = ([] as any).concat(array);

  for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  return newArr;
};
interface HowHeardProps {
  order: Order;
}

export const HowHeard: FunctionComponent<HowHeardProps> = ({ order }) => {
  const [selected, setSelected] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      await fetch('https://functions.tommyjohn.com/api/how-heard',  {
        method: 'POST',
        body: JSON.stringify({
          selected,
          orderId: order.orderId,
        }),
      });

      setIsSubmitted(true);

      if (Array.isArray((window as any)?._uxa)) {
        (window as any)._uxa.push(['trackPageEvent', `howHeard/${selected}`]);
      }
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
          { shuffleArray(options).map(option => (
            <option key={ option } value={ option }>{ option }</option>
          )) }
        </select>

        <button className="submit" disabled={ !selected }>Submit</button>
      </div>
    </form>
  );
};
