
CREATE TABLE `zones_transit` (
  `zone_id` int NOT NULL,
  `countryId` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `cityId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `city` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
