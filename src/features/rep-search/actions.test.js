import { fetchProfile  } from './actions'
import * as constants    from './constants'

describe('actions()', () => {
  it('should create a load profile action', () => {
    const expected = { type: constants.FETCH_PROFILE }
    expect(fetchProfile()).toEqual(expected)
  })
})
