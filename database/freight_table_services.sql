
CREATE TABLE `services` (
  `id` int NOT NULL,
  `parent` int NOT NULL,
  `slug` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `rate` varchar(50) NOT NULL,
  `transaction` int NOT NULL,
  `ratio` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
