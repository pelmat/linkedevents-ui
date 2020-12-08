import React from 'react'
import HelCheckBox from '../HelFormFields/HelCheckbox'
import {FormattedMessage} from 'react-intl'

function VirtualCheckbox() {
    return (
        <HelCheckBox 
            name='is_virtualevent'
            label={<FormattedMessage id='event-location'/>}
        />
    );
}

export default VirtualCheckbox;
