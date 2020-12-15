import React from 'react'
import {FormattedMessage} from 'react-intl'
import PropTypes from 'prop-types';
import EventGrid from '../../components/EventGrid'
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {withRouter} from 'react-router';
import './index.scss'


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        };
    }

    render() {
        const {user} = this.props;
        const {events} = this.state;
        return (
            <div className='homepage'>
                <div className='container header'/>
                <div className='container'>
                    <div className='content'>
                        <div className= 'row-homeheader'>
                            {user ? (
                                <div>
                                    <h1>Tervetuloa Linked-palveluihin, {user.firstName}</h1>
                                </div>
                            ) : (
                                <h1>Tervetuloa Linked-palveluihin</h1>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}
HomePage.propTypes = {
    events: PropTypes.array,
    user: PropTypes.object,
    routerPush: PropTypes.func,
}

const mapStateToProps = (state) => ({
    user: state.user,
})

export default connect(mapStateToProps)(HomePage);
