import React from 'react'
import DatePicker, {registerLocale} from 'react-datepicker'
import PropTypes from 'prop-types'
import {FormGroup, Label, Input, Button} from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import './CustomDatePicker.scss'
import DatePickerButton from './DatePickerButton'
import moment from 'moment'
import {FormattedMessage} from 'react-intl'
import fi from 'date-fns/locale/fi'
import sv from 'date-fns/locale/sv'
import {connect} from 'react-redux'
import {setData as setDataAction, updateSubEvent as updateSubEventAction} from 'src/actions/editor'
import {roundDateToCorrectUnit, getCorrectInputLabel, getCorrectMinDate, convertDateToLocaleString, getDateFormat} from '../../utils/datetime'


class CustomDateTime extends React.Component {
    constructor(props){
        super(props)
        const {defaultValue} = this.props

        registerLocale('fi', fi)
        registerLocale('sv', sv)

        this.state = {
            dateInputValue: defaultValue ? this.convertDateToLocaleString(defaultValue, 'date') : '',
            timeInputValue: defaultValue ? this.convertDateToLocaleString(defaultValue, 'time') : '',
        }

        this.handleInputChangeDate = this.handleInputChangeDate.bind(this)
        this.handleInputChangeTime = this.handleInputChangeTime.bind(this)
        this.handleInputBlur = this.handleInputBlur.bind(this)
        this.handleDateTimePickerChange = this.handleDateTimePickerChange.bind(this)
        this.mySubmitDataPassingFunction = this.mySubmitDataPassingFunction.bind(this)
        this.validateDate = this.validateDate.bind(this)

    }
    
    static contextTypes = {
        intl: PropTypes.object,
    }

    handleInputChangeDate(event){
        this.setState({dateInputValue: event.target.value, showValidationError: false})
    }

    handleInputChangeTime(event){
        this.setState({timeInputValue: event.target.value, showValidationError: false})
    }

    handleInputBlur(){
        const {dateInputValue, timeInputValue} = this.state
        if(!dateInputValue && !timeInputValue){
            this.setState({showValidationError: false})
        }
        this.mySubmitDataPassingFunction(dateInputValue, timeInputValue)
    }

    handleDateTimePickerChange(value, type){
        // update correct state value based on type
        // ie if type is 'date' update state.dateInputValue
        const convertedValue = convertDateToLocaleString(value, type)
        if(type === 'date'){
            this.setState({dateInputValue: convertedValue})
            this.mySubmitDataPassingFunction(convertedValue, this.state.timeInputValue)
        }
        if(type === 'time') {
            this.setState({timeInputValue: convertedValue})
            this.mySubmitDataPassingFunction(this.state.dateInputValue, convertedValue)
        }
    }
       
    mySubmitDataPassingFunction(date, time){
        const {setData, setDirtyState, updateSubEvent, minDate, eventKey, name} = this.props;
        let formattedDatetime = undefined
        if(date && time){
            // combine date and time into single datetime which is used in upper scope
            const datetimeString = `${date} ${time}`
            const datetime = roundDateToCorrectUnit(moment(datetimeString, getDateFormat('date-time'), true), 'date-time')
            if(this.validateDate(datetime, minDate)){
                formattedDatetime = moment(datetime).tz('Europe/Helsinki').utc().toISOString()                
            }
        }
        if(eventKey){
            updateSubEvent(formattedDatetime, name, eventKey)
        }
        else{
            setData({[name]: formattedDatetime})
        }
        setDirtyState()
    }

    validateDate(date, minDate){
        if(!moment(date, getDateFormat(this.props.type), true).isValid()){
            this.setState({
                validationErrorText: <FormattedMessage id="invalid-date-format" />,
                showValidationError: true,
            })
            return false
        }
        if(minDate){
            if(moment(date).isBefore(minDate)){
                this.setState({
                    validationErrorText: <FormattedMessage id="validation-afterStartTimeAndInFuture" />,
                    showValidationError: true,
                })
                return false
            }
        }

        this.setState({
            showValidationError: false,
        })
        return true
    }

    // returns the date DatePicker will show as selected when calendar is opened
    getDatePickerOpenDate(defaultValue, minDate){
        if(defaultValue)
            return new Date(defaultValue)
        else if(minDate)
            return new Date(minDate)
        else
            return new Date(roundDateToCorrectUnit(moment()))
    }


    render() {
        const {labelDate, labelTime, id, defaultValue, minDate, maxDate, disabled, required, intl} = this.props
        const {dateInputValue, timeInputValue, showValidationError, validationErrorText} = this.state
        const inputErrorId = 'date-input-error__' + id

        const dateFieldId = `${id}-date-field`
        const timeFieldId = `${id}-time-field`

        return (
            <div className="custom-date-input">
                <FormGroup>
                    <Label for={dateFieldId}>{getCorrectInputLabel(labelDate)}{required ? '*' : ''}</Label>
                    <div className="input-and-button">
                        <Input
                            aria-describedby={showValidationError ? inputErrorId : undefined}
                            aria-invalid={showValidationError}
                            type="text"
                            id={dateFieldId}
                            value={dateInputValue ? dateInputValue : ''}
                            onChange={this.handleInputChangeDate}
                            onBlur={this.handleInputBlur}
                            disabled={disabled}
                            required={required}
                        />
                        <DatePicker
                            disabled={disabled}
                            onChange={(value) => this.handleDateTimePickerChange(value, 'date')}
                            customInput={<DatePickerButton type={'date'} intl={intl} disabled={disabled} />}
                            locale={this.context.intl.locale}
                            openToDate={this.getDatePickerOpenDate(defaultValue, minDate)}
                            minDate={getCorrectMinDate(minDate)}
                            maxDate={maxDate && new Date(maxDate)}
                            showPopperArrow={true}
                            popperPlacement={'bottom-end'}
                            popperModifiers={{
                                preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: 'viewport',
                                },
                            }}
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label for={timeFieldId}>{getCorrectInputLabel(labelTime)}{required ? '*' : ''}</Label>
                    <div className="input-and-button">
                        <Input
                            aria-describedby={showValidationError ? inputErrorId : undefined}
                            aria-invalid={showValidationError}
                            type="text"
                            id={timeFieldId}
                            value={timeInputValue ? timeInputValue : ''}
                            onChange={this.handleInputChangeTime}
                            onBlur={this.handleInputBlur}
                            disabled={disabled}
                            required={required}
                        />
                        <DatePicker
                            disabled={disabled}
                            onChange={(value) => this.handleDateTimePickerChange(value, 'time')}
                            customInput={<DatePickerButton type={'time'} intl={intl} disabled={disabled} />}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption={<FormattedMessage id='time' />}
                            timeFormat="HH.mm"
                            showPopperArrow={true}
                            popperPlacement={'bottom-end'}
                            popperModifiers={{
                                preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: 'viewport',
                                },
                            }}
                        />                  
                    </div>
                      
                    {showValidationError && 
                        <p id={inputErrorId} role="alert" className="date-input-error">{validationErrorText}</p>}
                </FormGroup>
            </div>
        )
    }
}

CustomDateTime.propTypes = {
    labelDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    labelTime: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    onChange: PropTypes.func,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    type: PropTypes.oneOf(['date', 'time', 'date-time']),
    disablePast: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    setDirtyState: PropTypes.func,
    setData: PropTypes.func,
    updateSubEvent: PropTypes.func,
    eventKey: PropTypes.string,
    intl: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
    setData: (value) => dispatch(setDataAction(value)),
    updateSubEvent: (value, property, eventKey) => dispatch(updateSubEventAction(value, property, eventKey)),
})

export default connect(null, mapDispatchToProps)(CustomDateTime)
