var pool = require('../dbconfig');
var fast = require('../routes3');
var mg = require('../mg');

const MatrixPaths = async (data, getHubs, step = 0) => {
    let routes = [];

    getHubs.forEach((hub, j) => {
        if (j === 0) {
            routes.push({from: data.from.city, to: getHubs[step].fromCityId});
        }

        routes.push({
            from: hub.fromCityId,
            to: hub.toCityId,
            carrier: hub.serviceSlug
        });

        if (j === getHubs.length - 1) {
            routes.push({
                from: getHubs[getHubs.length - 2].toCityId,
                to: data.to.city
            });

        }
    });

    var transit = await pool
        .query(
            `SELECT r.id,s.slug,s.name,rs.service_id,r.fromCountryId,r.fromCityId,r.toCountryId,r.fromLat,r.fromLng,r.toLat,r.toLng,r.toCityId FROM routes_services rs, routes r, services s WHERE s.id=rs.service_id && r.id=rs.route_id && rs.service_id IN(1,2,3,4) && r.isHub!=0`,
            []
        )
        .then((x) => x[0]);
    transit.map((transit, i) => {
        routes.push({
            from: transit.fromCityId,
            to: transit.toCityId,
            carrier: transit.slug
        });
    });

    const MAGIC_ROUTES = [
        ...findPaths(graphify(routes), data.from.city, data.to.city)
    ];

    routes2 = MAGIC_ROUTES;
    routes = [];
    routes2.forEach((r, j) => (routes = [...routes, {cities: r, dests: []}]));

    return routes;
};

const MatrixDistances = async (routes, total) => {
    return Promise.all(routes)
        .then((x) => {
            let routes = [];
            // console.log("x", JSON.stringify({x}));

            x.map((y, i) => {
                let dests = x[i].cities.map((d, n) => {
                    if (n === 0) return {from: d, to: x[i].cities[n + 1]};
                    else if (n === x[i].cities.length - 1) return;
                    else return {from: d, to: x[i].cities[n + 1]};
                });
                rm_dests = dests.filter((el) => el != null);

                for (let j = 0; j < rm_dests.length; j++) {
                    let mixins = {};
                    if (j === 0)
                        mixins = {
                            carrier: {
                                slug: 'car',
                                name: 'Автомобильная перевозка',
                                service_id: 1
                            },
                            link: 'F'
                        };
                    else if (j === rm_dests.length - 1)
                        mixins = {
                            carrier: {
                                slug: 'car',
                                name: 'Автомобильная перевозка',
                                service_id: 1
                            },
                            link: 'L'
                        };
                    else mixins = {link: 'T'};

                    rm_dests[j] = {
                        ...rm_dests[j],
                        ...mixins
                    };
                }

                routes.push({
                    // ...x[i],
                    id: i + 1,
                    dests: rm_dests
                });
            });
            return routes;
        })
        .then(async (y) => {
            let routes = y;
            // console.log("y", JSON.stringify({routes}));

            for (let j = 0; j < routes.length; j++) {
                for (let k = 0; k < routes[j].dests.length; k++) {
                    let mixins = {};
                    if (
                        routes[j].dests[k].link === 'T' ||
                        routes[j].dests[k].link === 'L'
                    ) {
                        var transit = await pool
                            .query(
                                `SELECT r.id AS transitId,s.slug,s.name,rs.service_id FROM routes_services rs, routes r, services s WHERE s.id=rs.service_id && r.id=rs.route_id && rs.service_id IN(1,2,3,4) && r.isHub!=0 && r.fromCityId=? && r.toCityId=?`,
                                [routes[j].dests[k].from, routes[j].dests[k].to]
                            )
                            .then((x) => x[0]);

                        if (transit.length > 1) mixins = {carrier: transit[j]};
                        else if (transit.length === 1) mixins = {carrier: transit[0]};
                        else {
                            if (routes[j].dests[k].link === 'L' && transit.length === 0)
                                var skip = true;
                            else mixins = {carrier: transit};
                        }
                    }
                    //                 mixins = { carrier: transit }

                    routes[j].dests[k] = {
                        ...routes[j].dests[k],
                        ...mixins
                    };
                }
            }

            return routes;
        })
        .then((z) => {
            let routes = z;
            // console.log("z", JSON.stringify({routes}));

            for (let j = 0; j < routes.length; j++) {
                // remove empty-transit routes
                let f_empty = routes[j].dests.filter(
                    (x) => (x.link === 'T' || x.link === 'L') && !x.carrier
                ).length;
                // remove empty-T routes
                let f_empty_T = routes[j].dests.filter(
                    (x) => x.link === 'T' && typeof x.carrier !== 'object'
                ).length;
                if (routes[j].dests.length < 2 || f_empty || f_empty_T) {
                    delete routes[j];
                } else {
                    routes[j] = {
                        ...routes[j],
                        rId: JSON.stringify(routes[j].dests)
                            .split('')
                            .reduce(function (a, b) {
                                a = (a << 5) - a + b.charCodeAt(0);
                                return a & a;
                            }, 0)
                    };
                }
            }

            routes = routes.filter((e) => e != null);

            routes = routes.filter(
                (a, i, s) => i === s.findIndex((t) => t.rId === a.rId)
            );

            return routes;
        })
        .then((u) => {
            let routes = u;
            console.log("u", JSON.stringify({routes}));

            for (let i = 0; i < routes.length; i++) {
                routes[i] = routes[i];
                delete routes[i].rId;
                for (let j = 0; j < routes[i].dests.length; j++) {
                    routes[i].dests[j] = routes[i].dests[j];
                    delete routes[i].dests[j].carrier.transitId;
                    delete routes[i].dests[j].link;
                }
            }
            return routes;
        })
        .then(async (l) => {
            let routes = l;
            console.log("l", JSON.stringify({routes}));
            for (let i = 0; i < routes.length; i++) {
                for (let j = 0; j < routes[i].dests.length; j++) {
                    routes[i].dests[j] = routes[i].dests[j];

                    const f__pl = {
                        city: routes[i].dests[j].from,
                        country: await fast.getCountry(routes[i].dests[j].from)
                    };
                    const f__cors = await fast.getCors(`${f__pl.country} ${f__pl.city}`);
                    const t__pl = {
                        city: routes[i].dests[j].to,
                        country: await fast.getCountry(routes[i].dests[j].to)
                    };
                    const t__cors = await fast.getCors(`${t__pl.country} ${t__pl.city}`);

                    console.log({t__pl})

                    console.log({
                        "from": `${f__pl.city}+${f__pl.country}`,
                        "to": `${t__pl.city}+${t__pl.country}`,
                        "mode": routes[i].dests[j].carrier.slug
                    })
                    let DDMatrix = await fast.getDistance(
                        `${f__pl.city}+${f__pl.country}`,
                        `${t__pl.city}+${t__pl.country}`,
                        routes[i].dests[j].carrier.slug
                    );
                    console.log("DDMATRIX", {DDMatrix})
                    DDMatrix = DDMatrix.value ? DDMatrix.value : DDMatrix;
                    var prices = await fast.getPrice({
                        from: f__pl.city,
                        to: t__pl.city,
                        fromCountry: f__pl.country,
                        toCountry: t__pl.country,
                        carrier: routes[i].dests[j].carrier.slug,
                        distance:
                            parseInt((DDMatrix.distance.value / 1000).toFixed(0)) || 0,
                        weight: total.weight,
                        volume: total.volume
                    });

                    routes[i].dests[j] = {
                        ...routes[i].dests[j],
                        from: {...f__pl, cors: {lat: f__cors.lat, lng: f__cors.lng}},
                        to: {...t__pl, cors: {lat: t__cors.lat, lng: t__cors.lng}},
                        price: prices,
                        duration:
                            parseInt((DDMatrix.duration.value / 60 / 60).toFixed(0)) || 0,
                        distance: parseInt((DDMatrix.distance.value / 1000).toFixed(0)) || 0
                    };
                }

                routes[i] = {
                    ...routes[i],
                    price: {
                        eur: routes[i].dests.reduce((sum, {price}) => sum + price.eur, 0),
                        rub: routes[i].dests.reduce((sum, {price}) => sum + price.rub, 0),
                        cny: routes[i].dests.reduce((sum, {price}) => sum + price.cny, 0),
                        usd: routes[i].dests.reduce((sum, {price}) => sum + price.usd, 0)
                    },
                    duration: routes[i].dests.reduce(
                        (sum, {duration}) => sum + duration,
                        0
                    ),
                    distance: routes[i].dests.reduce(
                        (sum, {distance}) => sum + distance,
                        0
                    ),
                    volume: total.volume,
                    weight: total.weight
                };
            }
            return routes;
        });
};

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function* findPaths(graph, src, dst, path = [], visited = new Set()) {
    if (src === dst) {
        yield path.concat(dst);
    } else if (graph[src] && !visited.has(src)) {
        visited.add(src);
        path.push(src);

        for (const neighbor of graph[src]) {
            yield* findPaths(graph, neighbor, dst, path, visited);
        }

        visited.delete(src);
        path.pop(src);
    }
}

const graphify = (routes) => {
    const graph = {};
    var i = 0;
    for (const node of routes) {
        i++;
        if (!graph[node.from]) {
            graph[node.from] = [];
        }
        graph[node.from].push(node.to);
    }
    return graph;
};

exports.searchRoutes = async (req, res) => {
    /*  req = { body: { metric: { length: 'cm' }, total: { units:2, weight:400, volume:120000 },
    from: { country: 'Germany', city: { id: 'Neumark' }},
    to: { country: 'Russia', city: { id: 'Penza' }} }}
  */
    const data = {
        from: {
            country: req.body.from.country.id || 'Germany',
            city: req.body.from.city.id || 'Neumark'
        },
        to: {
            country: req.body.to.country.id || 'Russia',
            city: req.body.to.city.id || 'Moscow'
        }
    };

    let {carriages, metric, total, type} = req.body;
    if (metric.length === 'cm') total.volume = total.volume / 1000000;
    if (metric.weight === 'lb') total.weight = total.weight * 2.205;

    const search = await fast.saveSearch({
        from: data.from,
        to: data.to,
        metric: metric,
        type: type,
        carriages: carriages
    });

    var zone = await mg.one(data);
    var getHubs = await fast.getHubs({
        type: 'zone_id',
        zone_id: zone.zone_id
    });

    const MatrixGeometry = async (data, getHubs, j) => {
        const routes = await MatrixPaths(data, getHubs, j);
        return await MatrixDistances(routes, total);
    };

    const getData = async (getHubs) =>
        Promise.all(
            getHubs.map(async (hub, j) => MatrixGeometry(data, getHubs, j))
        );

    res.end(
        JSON.stringify({
            routes: await getData(getHubs).then((x) => [].concat.apply([], x)),
            search_id: search.search_id
        })
    );
};
