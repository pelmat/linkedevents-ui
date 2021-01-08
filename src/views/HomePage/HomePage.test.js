import React from 'react';
import {shallow} from 'enzyme';
import {IntlProvider, FormattedMessage} from 'react-intl';
import {Helmet} from 'react-helmet';
import moment from 'moment';
import EventGrid from '../../components/EventGrid'
import {withRouter} from 'react-router';
import {EventQueryParams, fetchEvents} from '../../utils/events'
import constants from '../../constants'
import {UnconnectedHomePage} from './HomePage';
import {Button} from 'reactstrap'

import mapValues from 'lodash/mapValues';
import fiMessages from 'src/i18n/fi.json';

const testMessages = mapValues(fiMessages, (value, key) => value);
const intlProvider = new IntlProvider({locale: 'fi', messages: testMessages}, {});
const {intl} = intlProvider.getChildContext();

const defaultProps = {
    location: window.location,
    routerPush: () => {},
    handleRouterClick: () => {},
}

describe('Homepage', () => {
    function getWrapper(props) {
        return shallow(<UnconnectedHomePage {...defaultProps} {...props}/>, {context: {intl}});
    }

    describe('render', () => {

        describe('elements', () => {

            test('EventGrid element', () => {
                const wrapper = getWrapper();
                const element = wrapper.find(EventGrid)
                expect(element).toHaveLength(1);
                expect(element.prop('homePage')).toBe(true);
                expect(element.prop('events')).toEqual([]);
            });

            test('Button element', () => {
                const wrapper = getWrapper();
                const button = wrapper.find(Button)
                expect(button).toHaveLength(3)
                button.forEach((element) => {
                    expect(element.prop('onClick')).toBeDefined();
                    expect(element.prop('className')).toBe('btn');
                });
            });
            test('formattedMessages', () => {
                const wrapper = getWrapper();
                const message = wrapper.find(FormattedMessage)
                expect(message).toHaveLength(3)
            })
        })
    })
})

