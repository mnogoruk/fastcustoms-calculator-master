const pool = require('../dbconfig');

async function getTransit(from = '', to = '', mode = 'car') {
  try {
    const GOOGLE_API_KEY = 'AIzaSyACh7KhtaWyofC_eZlCfV_9xXq6Tx7NWeg';

    let append_mode = 'driving';
    if (mode === 'rails' || mode === 'rail') {
      append_mode = 'transit&transit_mode=rail';
    } else {
      append_mode = 'driving';
    }
    const result = fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from}&destinations=${to}&mode=${append_mode}&language=ru&key=${GOOGLE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        return {
          from: data.origin_addresses[0],
          to: data.destination_addresses[0],
          distance: data.rows[0].elements[0].distance,
          duration: data.rows[0].elements[0].duration,
          mode: mode
        };
      });
    return result;
  } catch (e) {
    console.error(e);
  }
}

exports.getTransit = async (req, res) => {
  const transit = await getTransit(
    req.query.from,
    req.query.to,
    req.query.mode
  );
  res.end(JSON.stringify({ transit: transit }));
};
