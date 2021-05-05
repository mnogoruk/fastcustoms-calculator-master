const pool = require('../dbconfig');

exports.getZones = async (req, res) => {
  const { zone } = req.query;

  if (zone) {
    const parent = await pool.query(
      `SELECT z.* FROM
    zones z WHERE z.slug=? LIMIT 1`,
      [zone]
    );

    const zones = await pool.query(
      `SELECT zt.*, 
        (SELECT COUNT(*) FROM zones_transit ztc WHERE ztc.countryId=zt.countryId) AS total_cities
              FROM
    zones_transit zt WHERE zt.zone_id=?  GROUP BY zt.countryId`,
      [parent[0][0].id]
    );

    res.end(JSON.stringify({ zones: zones[0], zone: parent[0][0] }));
  } else {
    const zones = await pool
      .query(
        `SELECT z.*,
        (SELECT COUNT(*) FROM zones_transit zt WHERE zt.zone_id=z.id) AS total_cities,
        (SELECT COUNT(DISTINCT zt.countryId) FROM zones_transit zt WHERE zt.zone_id=z.id) AS total_countries
  
       FROM
    zones z ORDER BY z.id ASC`,
        []
      )
      .then((x) => x[0]);

    const dummyEmailReturn = async (n, i) => {
      const sub = await pool
        .query(
          `SELECT zt.country FROM
  zones_transit zt WHERE zt.zone_id=? GROUP BY zt.country`,
          [n.id]
        )
        .then((x) => x[0]);

      let out = [];
      out[i] = n;
      out[i]['includes'] = sub;
      return out;
    };

    const promises = zones.map(async (x) => {
      const user = await dummyEmailReturn(x); // second promise
      return {
        ...x
      };
    });

    const fresult = await Promise.all(promises);
    res.end(JSON.stringify({ zones: fresult }));

    //Promise.all(promises).then(function (geocodes) {

    //myPromise.then(res.send.bind(res));
  }
};
