
CREATE TABLE `searches` (
  `id` int NOT NULL,
  `fromCountry` varchar(255) NOT NULL,
  `fromCity` varchar(255) NOT NULL,
  `toCountry` varchar(255) NOT NULL,
  `toCity` varchar(255) NOT NULL,
  `metricLength` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `metricWeight` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
