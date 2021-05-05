
CREATE TABLE `zones` (
  `id` int NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `rate` varchar(50) NOT NULL,
  `ratio` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
