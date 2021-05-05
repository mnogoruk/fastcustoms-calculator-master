const pool = require('../dbconfig');

async function getRates() {
  try {
    const results = await pool.query(`SELECT r.*,
      (SELECT z.name FROM zones z WHERE z.id=r.zone_id LIMIT 1) AS zoneName,
      (SELECT s.name FROM services s WHERE s.id=r.service_id LIMIT 1) AS serviceName
       FROM
      rates r ORDER BY r.id ASC`);
    return results[0];
  } catch (e) {
    console.error(e);
  }
}

exports.getRates = async (req, res) => {
  const rates = await getRates();
  res.end(JSON.stringify({ rates: rates }));
};

exports.postRates = async (req, res) => {
  const { rates } = req.body;

  for (let i = 0; i < rates.length; i++) {
    await pool.query(
      'UPDATE rates SET rate_kg=?,rate_m=?,rate_ldm=? WHERE id=?',
      [rates[i].rate_kg, rates[i].rate_m, rates[i].rate_ldm, rates[i].id]
    );
  }

  res.end(JSON.stringify({ result: 'success' }));
};
