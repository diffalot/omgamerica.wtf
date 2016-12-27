import Inferno              from 'inferno'
import { Provider         } from 'inferno-redux'
import { createStore,
         combineReducers,
         applyMiddleware  } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger         from 'redux-logger'

import reducers             from './reducers'

let logger = createLogger({
  // Ignore `CHANGE_FORM` actions in the logger, since they fire after every keystroke
  predicate: (getState, action) => action.type !== 'CHANGE_FORM'
})

let sagaMiddleware = createSagaMiddleware()

const reducer = combineReducers(Object.assign({}, reducers, {}))

const store = createStore(reducer,
  applyMiddleware(
    sagaMiddleware,
    logger
  )
)

import runSagas from './sagas'

runSagas(sagaMiddleware)

import App from './containers/App'

Inferno.render(
  <Provider store={store}>
    <App />
  </Provider>
)

console.log('javascript running')
