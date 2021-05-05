
CREATE TABLE `hubs` (
  `id` int NOT NULL,
  `zone_id` int NOT NULL,
  `country` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `city` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `coordinates` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
