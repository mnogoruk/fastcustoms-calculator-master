const pool = require('./dbconfig');
const fetch = require('node-fetch');
const GOOGLE_API_KEY = 'AIzaSyACh7KhtaWyofC_eZlCfV_9xXq6Tx7NWeg';

const distanceDb = {
  get: async (from, to, method = 'car') => {
    return await pool
      .query(
        `SELECT d.value FROM distances d WHERE d.start=? && d.end=? && d.method=? LIMIT 1`,
        [from, to, method]
      )
      .then((x) => x[0][0]);
  },
  set: async (from, to, method = 'car', value = {}) => {
    const result = await pool
      .query(
        `SELECT COUNT(*) AS count FROM distances d WHERE d.start=? && d.end=? && d.method=? LIMIT 1`,
        [from, to, method]
      )
      .then((x) => x[0][0]);
    if (!result.count) {
      await pool.execute(
        'INSERT INTO distances(start,end,method,value) VALUES(?,?,?,?)',
        [from, to, method, value]
      );
    }
  }
};

module.exports = {
  createRoute: async (params) => {
    return params;
  },
  addTransit: async (params, route_id) => {
    return params;
  },
  getCors: async (place) => {
    try {
      const GEO_API_KEY = '81750c7abc7aac131ed91fdf2c2c92a6';

      const result = fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${GOOGLE_API_KEY}`
      )
        .then((res) => res.json())
        .then((res) => res.results[0].geometry.location);

      return result;
    } catch (e) {
      console.error(e);
    }
  },
  getCurrencies: async () => {
    try {
      const curr = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then((resp) => resp.json())
        .then((items) => items.Valute);
      return curr;
    } catch (e) {
      console.error(e);
    }
  },
  getExternalPrice: async (data) => {
    try {
      var zone = await module.exports.getZone({
        country: data.fromCountry,
        city: data.from
      });

      // get rates
      let getRates = await pool
        .query(
          `SELECT r.rate,r.ratio FROM rates r WHERE r.zone_id=? && r.service_id=? LIMIT 1`,
          [
            zone.zone_id,
            1 // by default car
          ]
        )
        .then((x) => x[0][0]);
      let getRate = (getRates && getRates.rate) || 0;

      let price = getRate * data.distance;

      const currencies = await module.exports.getCurrencies();

      return {
        rub: parseInt(price * currencies.EUR.Value),
        usd: parseInt((price * currencies.EUR.Value) / currencies.USD.Value),
        cny: parseInt((price * currencies.EUR.Value) / currencies.CNY.Value),
        eur: parseInt(price)
      };
    } catch (e) {
      console.error({ error: e, msg: '9f' });
    }
  },
  getPrice: async (data) => {
    try {
      /*var zone = await module.exports.getZone({
  country: data.fromCountry,
  city: data.from
});

let getRoute = await pool.query(
  `SELECT r.id FROM routes r WHERE r.zone_id=? && r.fromCityId=? && r.toCityId=? LIMIT 1`,
  [
  zone.zone_id,
  data.from,
  data.to
]
).then(x=> x[0][0]);
let getRouteId = getRoute && getRoute.id || 0

  // load services in RSA array
  let RouteServices = await pool.query(
    `SELECT rs.*,
    (SELECT s.slug FROM services s WHERE s.id=rs.service_id LIMIT 1) AS slug,
    (SELECT s.name FROM services s WHERE s.id=rs.service_id LIMIT 1) AS name
     FROM
  routes_services rs WHERE rs.route_id=?`,
    [getRouteId]
  ).then(x=> x[0]);
  let RSA = [];
  RouteServices.map((service) => RSA.push(service.service_id));
  
  let getMainService = await pool.query(
    `SELECT s.id FROM services s WHERE s.slug=?  LIMIT 1`,
    [
    data.carrier,
   // RSA ------- && s.id IN(?)
  ]
  ).then(x=> x[0][0]);
  let getMainServiceId = getMainService && getMainService.id || 0
  

// get rates
let getRates = await pool.query(
  `SELECT r.rate,r.ratio FROM rates r WHERE r.zone_id=? && r.service_id=? LIMIT 1`,
  [
  zone.zone_id,
  getMainServiceId
]
).then(x=> x[0][0]);
let getRate = getRates && getRates.rate || 0
*/

      var zone = await module.exports.getZone({
        country: data.fromCountry,
        city: data.from
      });

      let getRoute = await pool
        .query(
          `SELECT r.id,(SELECT rp.value FROM routes_prices rp WHERE rp.route_id=r.id && rp.context='kg'  LIMIT 1) AS price FROM routes r WHERE r.zone_id=? && r.fromCityId=? && r.toCityId=? LIMIT 1`,
          [zone.zone_id, data.from, data.to]
        )
        .then((x) => x[0][0]);
      let getRoutePrice = (getRoute && getRoute.price) || 0;

      if (!getRoutePrice) {
        let getRate = await pool
          .query(
            `SELECT r.rate_kg FROM rates r WHERE r.zone_id=? && r.service_id=? LIMIT 1`,
            [
              zone.zone_id,
              1 // default carrier yet
            ]
          )
          .then((x) => x[0][0]['rate_kg']);

        getRoutePrice = getRate;
      }

      let price = getRoutePrice * data.distance * data.weight;

      //console.log('rates', data)

      const currencies = await module.exports.getCurrencies();

      return {
        rub: parseInt(price * currencies.EUR.Value),
        usd: parseInt((price * currencies.EUR.Value) / currencies.USD.Value),
        cny: parseInt((price * currencies.EUR.Value) / currencies.CNY.Value),
        eur: parseInt(price)
        /*  fix: {
      distance: data.distance,
      zone_id: zone.zone_id,
      services: JSON.stringify(RSA),
      service_id: getMainServiceId,
      carrier: data.carrier
    }*/
      };
    } catch (e) {
      console.error({ error: e, msg: '7f' });
    }
  },
  saveSearch: async (data) => {
    const insert = await pool.execute(
      'INSERT INTO searches(fromCountry,fromCity,toCountry,toCity,metricLength,metricWeight,type) VALUES(?,?,?,?,?,?,?)',
      [
        data.from.country,
        data.from.city,
        data.to.country,
        data.to.city,
        data.metric.length || 'cm',
        data.metric.weight || 'kg',
        data.type || 'boxes'
      ]
    );
    let insert_id = insert[0].insertId;

    if (data.carriages) {
      data.carriages.map((row) => {
        let data = [
          insert_id,
          row.carriages.package,
          row.carriages.width,
          row.carriages.height,
          row.carriages.length,
          row.carriages.weight,
          row.carriages.units,
          row.carriages.containerType
        ];
        pool.execute(
          'INSERT INTO searches_carriages(search_id,type,width,height,length,weight,units,containerType) VALUES(?,?,?,?,?,?,?,?)',
          data
        );
      });
    }

    return { search_id: insert_id };
  },
  getDistance: async (from = '', to = '', mode = 'car') => {
    try {
      let append_mode = 'driving';
      if (mode === 'rails' || mode === 'rail') {
        append_mode = 'transit&transit_mode=rail';
      } else {
        append_mode = 'driving';
      }
      let cacheKey = `key_${from}_${to}-${mode}`;
      let cached = await distanceDb.get(from, to, mode);
      if (cached && cached.value) {
        console.log('cached ', cacheKey);
        return cached;
      }

      console.log('fetch google ', cacheKey);
      const result = fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${from}&destinations=${to}&mode=${append_mode}&language=ru&key=${GOOGLE_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          let output = {
            from: data.origin_addresses[0],
            to: data.destination_addresses[0],
            distance: data.rows[0].elements[0].distance,
            duration: data.rows[0].elements[0].duration,
            mode: mode
          };
          distanceDb.set(from, to, mode, output);
          return output;
        });
      return result;
    } catch (e) {
      console.error({ error: e, msg: '5f' });
    }
  },
  getZone: async (params) => {
    return await pool
      .query(
        `SELECT zt.zone_id FROM zones_transit zt WHERE zt.countryId=? && cityId=? LIMIT 1`,
        [params.country, params.city]
      )
      .then((x) => {
        if (x[0].length) return x[0][0];
        else return 0;
      });
  },
  getCountry: async (city) => {
    return await pool
      .query(
        `SELECT zt.countryId FROM zones_transit zt WHERE zt.cityId=? LIMIT 1`,
        [city]
      )
      .then((x) => {
        process.stdout.write(JSON.stringify(x[0]))
        if (x[0].length > 0){
          return x[0][0].countryId;
        }
      });
  },
  getHubs: async (params) => {
    switch (params.type) {
      case 'from':
        return await pool
          .query(
            `SELECT rs.service_id AS serviceId,
      s.name serviceName,
      s.slug serviceSlug,
      r.fromLat,r.fromLng,r.toLat,r.toLng,
      r.fromCountryId,r.fromCityId,r.toCountryId,r.toCityId
      FROM routes_services rs, routes r, services s WHERE r.id=rs.route_id && r.isHub!=0 && 
      (r.fromCityId=?) && s.id=rs.service_id
      && s.id IN (1,2,3,4)
      `,
            [params.from]
          )
          .then((x) => x[0]);
      case 'zone_id':
        return await pool
          .query(
            `SELECT rs.service_id AS serviceId,
          s.name serviceName,
          s.slug serviceSlug,
          r.fromLat,r.fromLng,r.toLat,r.toLng,
          r.fromCountryId,r.fromCityId,r.toCountryId,r.toCityId
          FROM routes_services rs, routes r, services s WHERE r.id=rs.route_id && r.isHub!=0
          && (r.zone_id=?)
          && s.id=rs.service_id && s.id IN (1,2,3,4)
          `,
            [params.zone_id]
          )
          .then((x) => x[0]);
    }
  },
  createSegment: (params = {}) => {
    const initialState = {
      method: {
        id: 0,
        slug: '',
        name: ''
      },
      from: {
        country: '',
        city: ''
      },
      to: {
        country: '',
        city: ''
      }
    };

    return { ...initialState, ...params };
  },
  createDestination: async (params) => {
    let segments = {};
    var typical = 'GROUP_CARGO';

    const { from, to, method, distance, duration } = params;

    switch (typical) {
      case 'GROUP_CARGO':
        let cors1 = await module.exports.getCors(
          `${from.country} ${from.city}`
        );
        let cors2 = await module.exports.getCors(`${to.country} ${to.city}`);
        segments = module.exports.createSegment({
          from: {
            country: from.country,
            city: from.city,
            cors: [cors1.lat || 0, cors1.lng || 0]
          },
          to: {
            country: to.country,
            city: to.city,
            cors: [cors2.lat || 0, cors2.lng || 0]
          },
          method: {
            id: method.id,
            slug: method.slug,
            name: method.name
          },
          distance: distance,
          duration: duration
        });
        return segments;
      case 'WHOLE_CARGO':
      default:
        return false;
    }
  }
};
