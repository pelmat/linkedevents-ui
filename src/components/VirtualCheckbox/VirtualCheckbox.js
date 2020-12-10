import React from 'react'
import HelCheckBox from '../HelFormFields/HelCheckbox'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types';

function VirtualCheckbox() {
    return (
        <HelCheckBox 
            name='is_virtualevent'
            label={<FormattedMessage id='event-location-virtual'/>}
        />
    );
}

export default VirtualCheckbox;
