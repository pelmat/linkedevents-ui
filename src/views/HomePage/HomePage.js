import React, {useState} from 'react'
import {
    injectIntl,
    FormattedMessage,
    FormattedDate,
    FormattedTime,
    intlShape,
} from 'react-intl'
import moment from 'moment';
import PropTypes from 'prop-types';
import EventGrid from '../../components/EventGrid'
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {withRouter} from 'react-router';
import './index.scss'
import {EventQueryParams, fetchEvents} from '../../utils/events'
import {isNull, get} from 'lodash'
import constants from '../../constants'
import {getOrganizationMembershipIds} from '../../utils/user'
import userManager from '../../utils/userManager';
import EventTable from '../../components/EventTable/EventTable'
import {Button} from 'reactstrap'
const {USER_TYPE, PUBLICATION_STATUS} = constants

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        };
    }
    componentDidMount() {
        this.fetchTableData()
    }

    /**
     * Fetches the event data
     */
    fetchTableData = async () => {
        const queryParams = this.getDefaultEventQueryParams()
        
        const response = await fetchEvents(queryParams)

        this.setState({events: response.data.data})
    }

    /**
     * Return the default query params to use when fetching event data
     * @returns {EventQueryParams}
     */
    getDefaultEventQueryParams = () => {
        const queryParams = new EventQueryParams()
        queryParams.super_event = 'none'
        queryParams.publication_status = PUBLICATION_STATUS.PUBLIC
        queryParams.include = 'location'
        queryParams.start = 'today'
        queryParams.end = 'today'
        return queryParams
    }

    getEvents() {
        const {events} = this.state;
        const homeEvents = events.slice(0,3)
        return (
            <EventGrid events={homeEvents} locale={this.props.locale} homePage={true} />
        )}

        handleRouterClick = (url) => {
            const {routerPush} = this.props;
            routerPush(url);
        }

        render() {
            const {user} = this.props;
            const userType = get(user, 'userType')

            let organization_missing_msg = null;
            if (user && !user.organization) {
                if (appSettings.ui_mode === 'courses') {
                    organization_missing_msg =
                    <div className='organization-missing-msg'>
                        <h1>
                            <FormattedMessage id='organization-missing-heading-courses'/>
                            {user.displayName}!
                        </h1>
                        <p>
                            <FormattedMessage id='organization-missing-message-courses'/>
                        </p>
                        <FormattedMessage id='organization-missing-message1'/>
                    </div>
                } else {
                    organization_missing_msg =
                    <div className='organization-missing-msg'>
                        <h1>
                            <FormattedMessage id='organization-missing-heading'/>
                            {user.displayName}!
                        </h1>
                        <p>
                            <FormattedMessage id='organization-missing-message'/>
                            <FormattedMessage id='organization-missing-message-contact'/>
                            <a href="mailto:matias.peltonen@turku.fi">
                                <FormattedMessage id='organization-missing-message-contact1'/>
                            </a>
                            <FormattedMessage id='organization-missing-message-contact2'/>
                        </p>
                        <FormattedMessage id='organization-missing-message1'/>
                    </div>
                }
            }

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
                            {this.props.location.pathname == '/' &&
                    <React.Fragment>
                        {organization_missing_msg}
                    </React.Fragment>
                            }
                            <div className='lorem'><h2>Linked-Palveluiden esittely</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra a nisl euismod dapibus. Quisque dignissim efficitur dui, ultrices molestie nibh ultrices in. In volutpat semper vulputate. Nunc sodales enim eget scelerisque consectetur. Morbi tellus quam, porttitor at pretium nec, fermentum ut lectus. Maecenas dolor diam, ullamcorper at nunc sit amet, mollis accumsan metus. Aenean pellentesque eleifend faucibus.

Nullam a venenatis nisl, nec bibendum enim. Cras quis lorem purus. Etiam elementum est sit amet neque efficitur consectetur. Proin sed enim sed neque mollis gravida. Vivamus sit amet ante a felis rhoncus feugiat. Aliquam luctus, nibh vitae ullamcorper consectetur, magna dui malesuada sapien, ut tristique augue risus eu lorem. Sed lacus sem, efficitur sit amet porttitor a, volutpat vel leo. Vivamus sollicitudin eget nisi nec accumsan. Suspendisse libero nisi, ultricies et malesuada nec, aliquam in nulla.

                                </p>
                                <h2>Tapahtuman järjestäjälle</h2>
                            </div>
                            <div className='homebuttons'>
                                <Button
                                    className='btn'
                                    onClick={() => this.handleRouterClick('/event/create/new')}
                                >
                                    <span aria-hidden className='glyphicon glyphicon-plus' />
                                    <FormattedMessage id={`create-${appSettings.ui_mode}`} />
                                </Button>
                                <Button
                                    className='btn'
                                    onClick={() => this.handleRouterClick('/search')}
                                >
                                    <span aria-hidden className='glyphicon glyphicon-search' />
                                    <FormattedMessage id={`search-${appSettings.ui_mode}`} />
                                </Button>
                                <Button
                                    className='btn'
                                    onClick={() => this.handleRouterClick('/help')}
                                >
                                    <span aria-hidden className='glyphicon glyphicon-question-sign' />
                                    <FormattedMessage id='more-info' />
                                </Button>
                            </div>
                            <div className='events'>
                                <h2>Tapahtumat tänään</h2>
                                {this.getEvents()}
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
    home: PropTypes.bool,
    location: PropTypes.object,
    locale: PropTypes.string,
    intl: intlShape,
}

const mapStateToProps = (state) => ({
    user: state.user,
    locale: state.userLocale.locale,
})

const mapDispatchToProps = (dispatch) => ({
    routerPush: (url) => dispatch(push(url)),
});

export {HomePage as UnconnectedHomePage}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
