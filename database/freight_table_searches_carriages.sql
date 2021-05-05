
CREATE TABLE `searches_carriages` (
  `id` int NOT NULL,
  `search_id` int NOT NULL,
  `type` varchar(100) NOT NULL,
  `width` varchar(100) NOT NULL,
  `height` varchar(100) NOT NULL,
  `length` varchar(100) NOT NULL,
  `weight` varchar(100) NOT NULL,
  `units` varchar(100) NOT NULL,
  `containerType` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
