import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import {getBadge} from '../../utils/helpers'
import {getStringWithLocale} from 'src/utils/locale';
import defaultThumbnail from '../../assets/images/helsinki-coat-of-arms-white.png'

import constants from '../../constants'
import './index.scss'

const dateFormat = function (timeStr) {
    return timeStr ? moment(timeStr).format('YYYY-MM-DD') : ''
}

const getName = (event) => {
    const paths = [
        'name.fi',
        'name.en',
        'name.sv',
        'headline.fi',
        'headline.en',
        'headline.sv',
    ]

    let name
    forEach(paths, (path) => {
        name = get(event, path)

        // We found a name, exit forEach
        if (name) {
            return false
        }
    })

    if (name) {
        return name
    }

    // If we don't have a name at this point, try to find a translation/locale from name field.
    forEach(get(event, 'name', []), (item) => {
        name = item
        return false
    })

    if (name) {
        return name
    }

    // If name field didn't have any translation/locale, then try to find one in headline field.
    forEach(get(event, 'headline', []), (item) => {
        name = item
        return false
    })

    // If name still doesn't have a value, then return an empty string.
    return name ? name : ''
}

const EventItem = (props) => {
    const name = getName(props.event)
    const url = '/event/' + encodeURIComponent(props.event['id']) + '/'
    const image = props.event.images.length > 0 ? props.event.images[0].url : defaultThumbnail
    const thumbnailStyle = {
        backgroundImage: 'url(' + image + ')',
    }
    const getStartingDay = props.event.start_time
    let convertedStartingDate = ''
    if (getStartingDay) {
        const date = getStartingDay.split('T')
        convertedStartingDate = date[0].split('-').reverse().join('.')
    }
    const getEndingDay = props.event.end_time
    let convertedEndingDate = ''
    if (getEndingDay) {
        const date = getEndingDay.split('T')
        convertedEndingDate = date[0].split('-').reverse().join('.')
    }
    let convertedStartingTime = ''
    if (getStartingDay) {
        const time = getStartingDay.split('T')
        convertedStartingTime = time[1].split('', 5)
    }
    let convertedEndingTime = ''
    if (getEndingDay) {
        const time = getEndingDay.split('T')
        convertedEndingTime = time[1].split('', 5)
    }

    let shortDescription = getStringWithLocale(props.event, 'short_description', props.locale)
    if (shortDescription && shortDescription.length > 120) {
        shortDescription = shortDescription.slice(0,120) + '..'
    }
    const location = getStringWithLocale(props.event.location, 'name', props.locale)
    const isCancelled = props.event.event_status === constants.EVENT_STATUS.CANCELLED
    const isPostponed = props.event.event_status === constants.EVENT_STATUS.POSTPONED
    //HomePages display
    if (props.homePage) {
        return (
            <div className="row event-home-row" key={props.event['id']}>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className="col-md-4 col-sm-12 event-item-home">
                            {isCancelled && getBadge('cancelled')}
                            {isPostponed && getBadge('postponed')}
                            <div className="thumbnail-home" style={thumbnailStyle}/>
                        </div>
                        <div className="col name-home">
                            <Link to={url}>
                                <h3> {name} </h3>
                            </Link>

                            <div className='info'>
                                <span aria-hidden className='glyphicon glyphicon-map-marker'/>
                                <p>{location}</p>
                            </div>


                            <div className='info'>
                                <span aria-hidden className='glyphicon glyphicon-calendar'/>
                                <p>{convertedStartingDate} - {convertedEndingDate}</p>
                            </div>
                            <div className='info'>
                                <span aria-hidden className='glyphicon glyphicon-time'/>
                                <p className="converted-day">{convertedStartingTime} - {convertedEndingTime}</p>
                            </div>


                            <div className='info'>
                                <span aria-hidden className='glyphicon glyphicon-pencil'/>
                                <p className='shortDescription'> {shortDescription}</p>
                            </div>

                        </div>

                    </div>
                    <div className='event-border'/>
                </div>
            </div>
        )
    }
    else
        return (
            <div className="col-xs-12 col-md-6 col-lg-4" key={props.event['id']}>
                <Link to={url}>
                    <div className="event-item">
                        {isCancelled && getBadge('cancelled')}
                        {isPostponed && getBadge('postponed')}
                        <div className="thumbnail" style={thumbnailStyle}/>
                        <div className="name">
                            <span className="converted-day">{convertedStartingDate}</span>
                            {name}
                        </div>

                    </div>
                </Link>
            </div>
        )
}

const EventGrid = (props) => (
    <div className="row event-grid">
        {props.events.map(event => <EventItem event={event} homePage={props.homePage} locale={props.locale} key={event.id}/>)}
    </div>
)

EventItem.propTypes = {
    event: PropTypes.object,
}

EventGrid.propTypes = {
    events: PropTypes.array,
    homePage: PropTypes.bool,
    locale: PropTypes.string,
}

export default connect()(EventGrid)
