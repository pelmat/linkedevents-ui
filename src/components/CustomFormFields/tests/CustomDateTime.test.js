import React from 'react'
import {shallow} from 'enzyme'
import moment from 'moment'

import {UnconnectedCustomDateTimeField} from '../CustomDateTimeField';
import CustomDateTime from '../CustomDateTime';
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
        return shallow(<CustomDateTime {...defaultProps} {...props} />);
    }

    describe('renders', () => {
        test('CustomDatePicker with correct props', () => {

            
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
