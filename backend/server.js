var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var path = require('path');
var express = require('express');
var app = express();
var dev = process.env.NODE_ENV !== 'production';
var defaultPort = 4001;

/**
 * load controllers
 */
var api = require('./controllers/api');

/**
 * express configuration
 */
app.set('port', process.env.PORT || defaultPort);
app.use(compress());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 3600000 * 24 * 7 })
); // a week
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  next();
});

/**
 * INDEX: get running status
 */
app.get('/', api.index);

/**
 * ROUTES: get routes details by Id
 */
app.get('/routes/:id', api.getRoute);

/**
 * ROUTES: save routes by Id in body
 */
app.post('/routes', api.postRoute);

/**
 * ROUTES: delete route by Id
 */
app.delete('/routes/:id', api.deleteRoute);

/**
 * ROUTES: search routes in the calculator
 */
app.post('/routes7', api.searchRoutes);

/**
 * ROUTES: routes relations in services
 */
app.get('/routes_relations', api.routesRelations);

/**
 * ORDERS: get all orders by phone and email
 */
app.get('/orders', api.getOrders);
app.delete('/orders/:id', api.deleteOrder);

app.get('/orders/:id/carriages', api.getCarriages);
app.post('/save', api.saveOrder);

/**
 * RATES: get rates in control panel
 */
app.get('/rates', api.getRates);

/**
 * RATES: update rates in control panel
 */
app.post('/rates', api.postRates);

/**
 * ZONES: get zones
 */
app.get('/zones', api.getZones);

/**
 * TRANSIT: get distance between two cities
 */
app.get('/transit', api.getTransit);

/**
 * SERVICES: get all services in control panel
 */
app.get('/services', api.getServices);

/**
 * SERVICES: get service details by id in control panel
 */
app.get('/services/:id', api.getService);

/**
 * SERVICES: save service by id
 */
app.post('/services/:id', api.postService);

/**
 * SERVICES: delete the service by ids in control panel
 */
app.delete('/services/:id', api.deleteService);

app.get('/test', api.searchRoutes);

// handle 404, keep this as a last route
// api.handleNotfound

/**
 * create server
 */
var httpServer = http.createServer(app);
httpServer.listen(app.get('port'), () => {
  console.log(`http server listening on port: ${app.get('port')}`);
});
