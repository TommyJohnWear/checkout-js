import React from 'react';

import { isSubscribedToText } from '../../store';
import { CheckboxFormField } from '../ui/form';

const TextSubscribe = () => {
  const onChange = () => {
    localStorage.setItem('subscribeToText', (!isSubscribedToText.get()).toString());
    isSubscribedToText.set(!isSubscribedToText.get());
  };

  return (
    <div className="form-body">
      <div id="subscribe-to-text-wrapper">
        <CheckboxFormField
            id="subscribe-to-text"
            labelContent={
            <>
              <h4 className="subscribe-heading">Sign up for text messages</h4>
              <p className="subscribe-subheading">
                Get exclusive offers and new arrivals when you sign up for texts
                from Tommy John.
              </p>
              <p className="subscribe-text">
                By checking this box, you agree to receive recurring automated
                promotional and personalized marketing text messages (e.g. cart
                reminders) from Tommy John at the cell number used when signing
                up. Consent is not a condition of any purchase. Reply HELP for
                help and STOP to cancel. Msg frequency varies. Msg & data rates
                may apply. View
                { ' ' }
                <a href="http://attn.tv/tommyjohn/terms.html" rel="noopener noreferrer" target="_blank">Terms</a>
                { ' ' }
                &
                { ' ' }
                <a href="https://attnl.tv/p/Z-n" rel="noopener noreferrer" target="_blank">Privacy</a>
                .
              </p>
            </>
          }
            name="subscribeToText"
            onChange={ onChange }
        />
      </div>
    </div>
  );
};

export default TextSubscribe;
