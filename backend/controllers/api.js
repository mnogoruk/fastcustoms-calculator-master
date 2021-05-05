var routes = require('./routes');
var services = require('./services');
var rates = require('./rates');
var orders = require('./orders');
var zones = require('./zones');
var transit = require('./transit');
var search = require('./search');

exports.getRoute = routes.getRoute;
exports.postRoute = routes.postRoute;
exports.deleteRoute = routes.deleteRoute;
exports.routesRelations = routes.routesRelations;
exports.searchRoutes = search.searchRoutes;
exports.getServices = services.getServices;
exports.getService = services.getService;
exports.postService = services.postService;
exports.deleteService = services.deleteService;
exports.getRates = rates.getRates;
exports.postRates = rates.postRates;
exports.getCarriages = orders.getCarriages;
exports.getOrders = orders.getOrders;
exports.deleteOrder = orders.deleteOrder;
exports.saveOrder = orders.saveOrder;
exports.getZones = zones.getZones;
exports.getTransit = transit.getTransit;

exports.index = (req, res) => {
  res.status(200).json({
    message: 'backend server is working',
    copyright: 'contact by phone +795235O5476',
    code: 200
  });
};

exports.handleNotfound = (req, res, next) => {
  res.status(404).json({
    message: "sorry, that method doesn't exist",
    code: 404
  });
};
