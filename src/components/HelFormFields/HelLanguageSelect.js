// Group of checkboxes that output an array on change

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import {setLanguages as setLanguageAction} from 'src/actions/editor.js';

class HelLanguageSelect extends React.Component {
    onChange = () => {
        const {options} = this.props;
        const checkedOptions = options
            .filter((option, index) => this[`checkRef${index}`].checked)
            .map((checkedOption) => checkedOption.value);

        this.props.setLanguages(checkedOptions);

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(checkedOptions);
        }
    };

    render() {
        const {options, checked} = this.props;
        const checkboxes = options.map((item, index) => {
            const checkedOptions = checked;
            const isChecked = checkedOptions && checkedOptions.includes(item.value);
            const disabled = isChecked && checkedOptions && checkedOptions.length === 1;

            return (
                <div className='custom-control custom-checkbox' key={index}>
                    <input
                        id={`checkBox-${item.value}`}
                        className='custom-control-input'
                        type='checkbox'
                        ref={(ref) => (this[`checkRef${index}`] = ref)}
                        key={index}
                        name={item.value}
                        checked={isChecked}
                        disabled={disabled}
                        onChange={this.onChange}
                        aria-checked={isChecked}
                    />
                    <label className='custom-control-label' htmlFor={`checkBox-${item.value}`}>
                        <FormattedMessage id={item.label} />
                    </label>
                </div>
            );
        });

        return <div className='language-selection'>{checkboxes}</div>;
    }
}

HelLanguageSelect.propTypes = {
    setLanguages: PropTypes.func,
    onChange: PropTypes.func,
    options: PropTypes.array,
    checked: PropTypes.array,
};

const mapDispatchToProps = (dispatch) => ({
    setLanguages: (langs) => dispatch(setLanguageAction(langs)),
});

const mapStateToProps = () => ({});
// TODO: if leave null, react-intl not refresh. Replace this with better React context
export default connect(mapStateToProps, mapDispatchToProps)(HelLanguageSelect);
