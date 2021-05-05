
CREATE TABLE `distances` (
  `id` int NOT NULL,
  `start` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `end` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `method` varchar(50) NOT NULL,
  `value` json NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
