import React       from 'react'
import { shallow } from 'enzyme'

import { App     } from './App'

it('renders without crashing', () => {
  let state = {
    auth: {}
  }
  shallow(<App data={state} history={{}} location={{}} dispatch={jest.fn()} />)
})
