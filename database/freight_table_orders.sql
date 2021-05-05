
CREATE TABLE `orders` (
  `id` int NOT NULL,
  `search_id` int NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sh_email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sh_phone` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sh_company` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sh_zipcode` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sh_address` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sh_contacter` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `rec_email` varchar(255) NOT NULL,
  `rec_phone` varchar(50) NOT NULL,
  `rec_company` varchar(255) NOT NULL,
  `rec_zipcode` varchar(50) NOT NULL,
  `rec_address` varchar(500) NOT NULL,
  `rec_contacter` varchar(100) NOT NULL,
  `distance` varchar(100) NOT NULL,
  `duration` int NOT NULL,
  `price` varchar(255) NOT NULL,
  `volume` varchar(100) NOT NULL,
  `weight` varchar(100) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
