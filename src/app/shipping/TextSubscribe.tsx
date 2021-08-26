import React from 'react';

import { CheckboxFormField, Fieldset } from '../ui/form';

const TextSubscribe = () => (
  <div className="form-body">
      <div id="subscribe-to-text-wrapper">
          <CheckboxFormField
              id="subscribe-to-text"
              labelContent={
                  <div>
                      <h4 className="subscribe-heading">Sign up via text messages</h4>
                      <p className="subscribe-subheading">Get exclusive offers and new arrivals when you sign up for texts from Tommy John.</p>
                      <p className="subscribe-text">messages (e.g. cart reminders) from Tommy John at the cell number used when signing up. Consent is not a condition of any purchase. Reply HELP for help and STOP to cancel. Msg frequency varies. Msg & data rates may apply. View Terms & Privacy.</p>
                  </div>
              }
              name="subscribeToText"
              // onChange={ onChange }
          />
      </div>
  </div>
);

export default TextSubscribe;
