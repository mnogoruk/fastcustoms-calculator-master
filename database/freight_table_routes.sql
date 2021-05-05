
CREATE TABLE `routes` (
  `id` int NOT NULL,
  `zone_id` int NOT NULL,
  `fromCountryId` varchar(255) NOT NULL,
  `fromCountry` varchar(255) NOT NULL,
  `fromCityId` varchar(255) NOT NULL,
  `fromCity` varchar(255) NOT NULL,
  `fromLat` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `fromLng` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `toCountryId` varchar(255) NOT NULL,
  `toCountry` varchar(255) NOT NULL,
  `toCityId` varchar(255) NOT NULL,
  `toCity` varchar(255) NOT NULL,
  `toLat` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `toLng` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `isHub` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
