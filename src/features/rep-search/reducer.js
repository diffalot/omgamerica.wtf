import * as constants from './constants'

let initialState = {
  fetchingProfile: false
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_PROFILE:
      return Object.assign({}, state, {
        fetchingProfile: true
      })
    case constants.FETCH_PROFILE_BEGIN:
      return Object.assign({}, state, {
        fetchingProfile: true
      })
    case constants.FETCH_PROFILE_END:
      return Object.assign({}, state, action.payload, {
        fetchingProfile: false
      })
    case constants.FETCH_PROFILE_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
        fetchingProfile: false
      })
    default:
      return state
  }
}

export default reducer
