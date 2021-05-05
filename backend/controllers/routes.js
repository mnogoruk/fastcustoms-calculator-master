const pool = require('../dbconfig');

exports.getRoute = async (req, res) => {
    const {id} = req.params;

    let route = await pool
        .query(
            `SELECT r.* FROM
    routes r WHERE r.id=? LIMIT 1`,
            [id]
        )
        .then((x) => x[0][0]);

    let services = await pool
        .query(
            `SELECT rs.service_id AS id,
        s.slug,
        s.rate,
        s.ratio,
        s.transaction,
        rs.priceKg,
        rs.priceM,
        rs.priceLdm,
        rs.priceS,
        s.name FROM
    routes_services rs LEFT JOIN services s ON s.id=rs.service_id WHERE rs.route_id=?`,
            [id]
        )
        .then((x) => x[0])
        .then((x) => {
            let services = x;
            services.map((s) => {
                s['prices'] = {
                    kg: parseFloat(s.priceKg),
                    m: parseFloat(s.priceM),
                    ldm: parseFloat(s.priceLdm),
                    s: parseFloat(s.priceS)
                };
                delete s['priceKg'];
                delete s['priceM'];
                delete s['priceLdm'];
                delete s['priceS'];

                if (s.id <= 4) {
                    delete s['prices'];
                }

                return s;
            });

            return services;
        });

    let prices = await pool
        .query(
            `SELECT rp.context,rp.rangeFrom,rp.rangeTo,rp.value FROM routes_prices rp WHERE rp.route_id=?`,
            [id]
        )
        .then((x) => x[0])
        .then((x) => {
            let y = x;
            y.map((s) => {
                s['rangeFrom'] = parseFloat(s['rangeFrom']);
                s['rangeTo'] = parseFloat(s['rangeTo']);
                s['value'] = parseFloat(s['value']);
                return s;
            });

            return y;
        });

    delete route['isHub'];

    prices = prices.sort(
        (a, b) => parseFloat(a.rangeFrom) - parseFloat(b.rangeFrom)
    );

    res.end(JSON.stringify({route: route, prices: prices, services: services}));
};

exports.postRoute = async (req, res) => {
    let fast = require('../routes3');

    const {id, from, to, services, selServices, prices} = req.body;
    const found = await pool.query(
        `SELECT r.id FROM
    routes r WHERE r.fromCountryId=? && r.fromCityId=? && r.toCountryId=? && r.toCityId=? LIMIT 1`,
        [from.country_id, from.city_id, to.country_id, to.city_id]
    );
    const foundId = found[0][0] ? found[0][0]['id'] : 0;

    let regions = await pool
        .query(
            `SELECT zt.zone_id FROM
    zones_transit zt WHERE zt.countryId=? LIMIT 1`,
            [from.country_id]
        )
        .then((x) => x[0][0].zone_id);

    if (!regions)
        res.end(
            JSON.stringify({
                result: 'error',
                msg:
                    'No specified city in loaded library cities in your requested country'
            })
        );

    let insert_id = foundId;
    if (foundId) {
        //   await pool.query("DELETE FROM routes WHERE id=?", [foundId]);
        await pool.query('DELETE FROM routes_services WHERE route_id=?', [foundId]);
        await pool.query('DELETE FROM routes_prices WHERE route_id=?', [foundId]);
    } else {
        var get1stCors = await fast.getCors(
            `${from.city_name}, ${from.country_name}`
        );
        var get2ndCors = await fast.getCors(`${to.city_name}, ${to.country_name}`);
        const insert = await pool.execute(
            'INSERT INTO routes(zone_id,fromCountryId,fromCountry,fromCityId,fromCity,toCountryId,toCountry,toCityId,toCity,fromLat,fromLng,toLat,toLng,isHub) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
                regions,
                from.country_id,
                from.country_name,
                from.city_id,
                from.city_name,
                to.country_id,
                to.country_name,
                to.city_id,
                to.city_name,
                get1stCors.lat,
                get1stCors.lng,
                get2ndCors.lat,
                get2ndCors.lng,
                1
            ]
        );
        insert_id = insert[0].insertId;
    }

    selServices.map((service) => {
        pool.execute(
            'INSERT INTO routes_services(route_id,service_id,priceKg,priceM,priceLdm,priceS) VALUES(?,?,?,?,?,?)',
            [
                insert_id,
                service.id,
                (service.prices && service.prices.kg) || 0,
                (service.prices && service.prices.m) || 0,
                (service.prices && service.prices.ldm) || 0,
                (service.prices && service.prices.s) || 0
            ]
        );
    });

    const generatePrices = (pricesArray, metric) => {
        let pr = [];
        pr = pricesArray && pricesArray[metric];

        return {arr: pr, metric: metric};
    };

    Promise.all([
        generatePrices(prices, 'kg'),
        generatePrices(prices, 'm'),
        generatePrices(prices, 'ldm')
    ]).then((values) => {
        values.map((jdk, j) => {
            jdk.arr.map((price, i) => {
                pool.execute(
                    'INSERT INTO routes_prices(route_id,context,rangeFrom,rangeTo,value) VALUES(?,?,?,?,?)',
                    [
                        insert_id,
                        jdk.metric,
                        i === 0 ? 0 : jdk.arr[i - 1].id,
                        price.id,
                        price.price
                    ]
                );
            });

        });
    });

    res.end(JSON.stringify({result: 'success'}));
};

exports.deleteRoute = async (req, res) => {
    const {id} = req.params;

    const found = await pool.query(
        `SELECT r.id FROM
    routes r WHERE r.id=? LIMIT 1`,
        [id]
    );
    const foundId = found[0][0] ? found[0][0]['id'] : 0;

    if (foundId) {
        await pool.query('DELETE FROM routes WHERE id=?', [foundId]);
        await pool.query('DELETE FROM routes_services WHERE route_id=?', [foundId]);
        await pool.query('DELETE FROM routes_prices WHERE route_id=?', [foundId]);
    }

    res.end(JSON.stringify({result: 'success'}));
};

exports.routesRelations = async (req, res) => {
    const routes = await pool.query(
        `SELECT r.*,(SELECT z.name FROM zones z WHERE z.id=r.zone_id LIMIT 1) AS zoneName
    
    FROM
routes r ORDER BY r.id DESC LIMIT 0,100`,
        []
    );

    let routesList = routes[0];
    for (const i in routesList) {
        const services = await pool.query(
            `SELECT rs.*,s.name,
      (SELECT r.rate FROM rates r WHERE r.zone_id=(SELECT r.zone_id FROM routes r WHERE r.id=rs.route_id LIMIT 1) && r.service_id=rs.service_id LIMIT 1) AS rate,      
      (SELECT r.ratio FROM rates r WHERE r.zone_id=(SELECT r.zone_id FROM routes r WHERE r.id=rs.route_id LIMIT 1) && r.service_id=rs.service_id LIMIT 1) AS ratio,      

      (SELECT s.rate FROM services s WHERE s.id=rs.service_id LIMIT 1) AS rateService,
      (SELECT s.ratio FROM services s WHERE s.id=rs.service_id LIMIT 1) AS ratioService,
      (SELECT s.transaction FROM services s WHERE s.id=rs.service_id LIMIT 1) AS transactionService

      
      FROM
  routes_services rs LEFT JOIN services s ON s.id=rs.service_id WHERE rs.route_id=? `,
            [routesList[i]['id']]
        );
        routesList[i].services = services[0];
    }

    res.end(JSON.stringify({routes: routesList, services: []}));
};
