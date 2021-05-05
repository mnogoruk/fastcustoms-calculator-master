
CREATE TABLE `routes_prices` (
  `id` int NOT NULL,
  `route_id` int NOT NULL,
  `context` varchar(50) NOT NULL,
  `rangeFrom` varchar(50) NOT NULL,
  `rangeTo` varchar(50) NOT NULL,
  `value` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
