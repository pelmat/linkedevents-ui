import PropTypes from 'prop-types';
import React, {useRef} from 'react'
import moment from 'moment-timezone'
import {connect} from 'react-redux'
import {setData as setDataAction, updateSubEvent as updateSubEventAction} from 'src/actions/editor'
import ValidationPopover from 'src/components/ValidationPopover'
import {isNil} from 'lodash'
import CustomDatePicker from './CustomDatePicker';
import './CustomDateTime.scss'

const onChange = (
    value,
    name,
    eventKey,
    updateSubEvent,
    setData,
    setDirtyState = () => {}
) => {
    const formattedValue = !isNil(value)
        ? value.isValid()
            // if valid, convert to utc time and format to ISO string
            ? moment(value).tz('Europe/Helsinki').utc().toISOString()
            // use moment input value if the date is invalid
            : value.creationData().input
        : undefined

    eventKey
        ? updateSubEvent(formattedValue, name, eventKey)
        : setData({[name]: formattedValue})

    setDirtyState()
}

const CustomDateTimeField = ({
    id,
    name,
    eventKey,
    defaultValue,
    disabled,
    disablePast,
    labelDate,
    labelTime,
    validationErrors,
    setData,
    updateSubEvent,
    setDirtyState,
    minDate,
    maxDate,
    required,
}) => {
    const containerRef = useRef(null)

    return (
        <div className='event-pickers'>
            <div className='event-pickers-date' ref={containerRef}>
                <CustomDatePicker
                    id={id}
                    type={'date'}
                    name={name}
                    label={labelDate}
                    disabled={disabled}
                    disablePast={disablePast}
                    defaultValue={defaultValue}
                    onChange={value => onChange(value, name, eventKey, updateSubEvent, setData, setDirtyState)}
                    minDate={minDate}
                    maxDate={maxDate}
                    required={required}
                />
                <ValidationPopover
                    anchor={containerRef.current}
                    placement={'right'}
                    validationErrors={validationErrors}
                />
            </div>
            <div className='event-pickers-time'>
                <CustomDatePicker
                    id={id}
                    type={'time'}
                    name={name}
                    label={labelTime}
                    disabled={disabled}
                    defaultValue={defaultValue}
                    onChange={value => onChange(value, name, eventKey, updateSubEvent, setData, setDirtyState)}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            </div>
        </div>
    )
}

CustomDateTimeField.propTypes = {
    id: PropTypes.string.isRequired,
    setData: PropTypes.func,
    updateSubEvent: PropTypes.func,
    name: PropTypes.string.isRequired,
    eventKey: PropTypes.string,
    defaultValue: PropTypes.string,
    setDirtyState: PropTypes.func,
    labelDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    labelTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    validationErrors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    disabled: PropTypes.bool,
    disablePast: PropTypes.bool,
    required: PropTypes.bool,
    minDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    maxDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
}

const mapDispatchToProps = (dispatch) => ({
    setData: (value) => dispatch(setDataAction(value)),
    updateSubEvent: (value, property, eventKey) => dispatch(updateSubEventAction(value, property, eventKey)),
})

export {CustomDateTimeField as UnconnectedCustomDateTimeField}
export default connect(null, mapDispatchToProps)(CustomDateTimeField)
