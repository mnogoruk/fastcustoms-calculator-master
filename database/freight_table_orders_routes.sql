
CREATE TABLE `orders_routes` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `fromCity` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `fromCountry` varchar(255) NOT NULL,
  `toCity` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `toCountry` varchar(255) NOT NULL,
  `carrier_id` int NOT NULL DEFAULT '0',
  `carrier` varchar(100) NOT NULL,
  `fromCors` varchar(100) NOT NULL,
  `toCors` varchar(100) NOT NULL,
  `distance` int UNSIGNED NOT NULL,
  `duration` int NOT NULL,
  `price` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
