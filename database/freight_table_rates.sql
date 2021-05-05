
CREATE TABLE `rates` (
  `id` int NOT NULL,
  `service_id` int NOT NULL,
  `zone_id` int NOT NULL,
  `rate` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ratio` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `rate_kg` varchar(50) NOT NULL DEFAULT '1',
  `rate_m` varchar(50) NOT NULL DEFAULT '1',
  `rate_ldm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
