import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch'
import { receiveEvents } from './events'
import constants from '../constants'

import authedFetch from 'src/utils/authedFetch'

import { setFlashMsg } from './app'

function makeRequest(user = {}, page, dispatch) {
    const {organization} = user
    var url = `${appSettings.api_base}/event/?organization=${organization}&show_all=1&sort=-last_modified_time&page_size=100`
    if(appSettings.nocache) {
        url += `&nocache=${Date.now()}`
    }

    let options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }

    //var url = `${appSettings.api_base}/event/?show_all=1&sort=-last_modified_time&page_size=100`
    return authedFetch(url, options, user, dispatch);
}

export const startFetching = createAction(constants.REQUEST_EVENTS);

export function fetchUserEvents(user, page) {
    return (dispatch) => {
        dispatch(startFetching);
        makeRequest(user, page, dispatch).then(function (response) {
            if (response.status >= 400) {
                dispatch(receiveEvents({
                    error: 'API Error ' + response.status}));
            }
            response.json().then(json => dispatch(receiveEvents(json)));
        })
        .catch(e => {
            // Error happened while fetching ajax (connection or javascript)
        });
    }
}
