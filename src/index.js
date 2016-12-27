import Inferno              from 'inferno'
import { Provider         } from 'inferno-redux'
import { createStore,
         combineReducers,
         applyMiddleware  } from 'redux'
import createLogger         from 'redux-logger'

import reducers             from './reducers'

let logger = createLogger({
  // Ignore `CHANGE_FORM` actions in the logger, since they fire after every keystroke
  predicate: (getState, action) => action.type !== 'CHANGE_FORM'
})

const reducer = combineReducers(Object.assign({}, reducers, {}))

const store = createStore(reducer,
  applyMiddleware(
    logger
  )
)

import App from './containers/App'

Inferno.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('app'))

console.log('javascript running')
