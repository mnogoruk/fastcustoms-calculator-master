const pool = require('./dbconfig');
const fetch = require('node-fetch');
const fast = require('./routes3');

module.exports = {
  // 1 step - get zone -> INT getZone.zone_id
  one: async (data) => {
    return await fast.getZone({
      country: data.from.country,
      city: data.from.city
    });
  }
};
