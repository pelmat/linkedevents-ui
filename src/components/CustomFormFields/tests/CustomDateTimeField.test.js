import React from 'react'
import {shallow} from 'enzyme'
import moment from 'moment'

import {UnconnectedCustomDateTimeField} from '../CustomDateTimeField';
import CustomDatePicker from '../CustomDatePicker';
import ValidationPopover from 'src/components/ValidationPopover'


describe('CustomDateTimeField', () => {
    const defaultProps = {
        id: 'test-id',
        setData: () => {},
        updateSubEvent: () => {},
        name: 'test-name',
        eventKey: 'test-event-key',
        defaultValue: moment('2020-03-25').toString(),
        setDirtyState: () => {},
        label: ['test-label-date', 'test-label-time'],
        validationErrors: {error: 'test-error'},
        disabled: false,
        disablePast: false,
        minDate: moment('2020-03-23'),
        maxDate: moment('2020-04-23'),
        type: ['date', 'time'],
    }

    function getWrapper(props) {
        return shallow(<UnconnectedCustomDateTimeField {...defaultProps} {...props} />);
    }

    describe('renders', () => {
        test('CustomDatePicker with correct props', () => {
            const datePicker = getWrapper().find(CustomDatePicker)
            expect(datePicker).toHaveLength(2)
            datePicker.forEach((element, index) => {
                expect(element.prop('id')).toBe(defaultProps.id)
                expect(element.prop('type')).toBe(defaultProps.type[index])
                expect(element.prop('label')).toBe(defaultProps.label[index])
                expect(element.prop('name')).toBe(defaultProps.name)
                expect(element.prop('disabled')).toBe(defaultProps.disabled)
                expect(element.prop('disablePast')).toBe(defaultProps.disablePast)
                expect(element.prop('defaultValue')).toBe(defaultProps.defaultValue)
                expect(element.prop('onChange')).toBeDefined()
                expect(element.prop('minDate')).toBe(defaultProps.minDate)
                expect(element.prop('maxDate')).toBe(defaultProps.maxDate)
                expect(element.prop('required')).toBe(false)
            });
        })

        test('ValidationPopover with correct props', () => {
            const validationPopover = getWrapper().find(ValidationPopover)
            expect(validationPopover).toHaveLength(1)
            expect(validationPopover.prop('anchor')).toBe(null)
            expect(validationPopover.prop('placement')).toBe('right')
            expect(validationPopover.prop('validationErrors')).toBe(defaultProps.validationErrors)
        })
    })
})
