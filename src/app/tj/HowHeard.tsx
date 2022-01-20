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

export const HowHeard: FunctionComponent = () => {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const lastSelected = localStorage?.getItem('selectHowHeard');
    lastSelected ? setSelected(lastSelected) : setSelected('');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    localStorage.setItem('selectHowHeard', val);
    setSelected(val);
  };

  return(
      <form id="how-heard">
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
