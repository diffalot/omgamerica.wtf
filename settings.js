require('dotenv').config()

module.exports = {
  sunlightKey: process.env.SUNLIGHT_KEY,
  twilioSid: process.env.TWILIO_SID,
  twilioToken: process.env.TWILIO_TOKEN,
  bill: {
    state: process.env.BILL_STATE,
    year: process.env.BILL_YEAR,
    query: process.env.BILL_QUERY
  },
  stateName: process.env.STATE_NAME
}
