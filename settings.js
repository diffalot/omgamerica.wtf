require('dotenv').config()

module.exports = {
  sunlightKey: process.env.SUNLIGHT_KEY,
  bill: {
    state: process.env.BILL_STATE,
    year: process.env.BILL_YEAR,
    query: process.env.BILL_QUERY
  },
  stateName: process.env.STATE_NAME
}
