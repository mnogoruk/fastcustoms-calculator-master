

ALTER TABLE `distances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique` (`start`,`end`,`method`) USING BTREE;

ALTER TABLE `hubs`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `orders_routes`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `rates`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fromCityId` (`fromCityId`,`toCityId`);

ALTER TABLE `routes_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `context` (`context`,`rangeFrom`);

ALTER TABLE `routes_services`
  ADD UNIQUE KEY `route_id` (`route_id`,`service_id`);

ALTER TABLE `searches`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `searches_carriages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `search_id` (`search_id`);

ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `zones`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `zones_transit`
  ADD PRIMARY KEY (`zone_id`,`countryId`,`cityId`),
  ADD KEY `countryId` (`countryId`),
  ADD KEY `cityId` (`cityId`),
  ADD KEY `zone_id` (`zone_id`);


ALTER TABLE `distances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `hubs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `orders_routes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `rates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `routes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `routes_prices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `searches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `searches_carriages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `services`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `zones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
