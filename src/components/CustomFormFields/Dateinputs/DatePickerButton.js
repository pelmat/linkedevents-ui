import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'reactstrap'
import {injectIntl} from 'react-intl'

function DatePickerButton ({intl, disabled, onClick, type}) {
    const iconClass =  type !== 'time' ? 'glyphicon glyphicon-calendar' : 'glyphicon glyphicon-time'

    return (
        <Button
            disabled={disabled}
            aria-hidden
            aria-label={intl.formatMessage({id: 'date-picker-button-label'})}
            tabIndex={-1}
            onClick={onClick}
            className={'custom-date-input__button' + ' ' + iconClass}>
        </Button>
    )
}

DatePickerButton.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    intl: PropTypes.object,
}
export {DatePickerButton as UnconnectedDatePickerButton}
export default injectIntl(DatePickerButton)
