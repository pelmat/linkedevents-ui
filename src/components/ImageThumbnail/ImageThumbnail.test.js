import React from 'react';
import {shallow, mount} from 'enzyme';

import {UnconnectedImageThumbnail} from './index';
import {IntlProvider, FormattedMessage} from 'react-intl';
import fiMessages from 'src/i18n/fi.json';
import mapValues from 'lodash/mapValues';
import {Button} from 'reactstrap'
const testMessages = mapValues(fiMessages, (value, key) => value);
const intlProvider = new IntlProvider({locale: 'fi', messages: testMessages}, {});
const {intl} = intlProvider.getChildContext();

const defaultProps = {
    data: {
        id: 123,
    },
    intl,
}

describe('ImageThumbnail', () => {
    function getWrapper(props) {
        return shallow(<UnconnectedImageThumbnail {...defaultProps} {...props} />, {context: {intl}});
    }
    describe('render', () => {
    })

    describe('buttons', () =>{
        test('correct amount', () => {
            const element = getWrapper().find(Button);
            expect(element).toHaveLength(3);
        })
    })
})
