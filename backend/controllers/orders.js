const pool = require('../dbconfig');
const fetch = require('node-fetch');

async function getPrice() {
  try {
    const curr = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
      .then((resp) => resp.json())
      .then((items) => items.Valute);
    return curr;
  } catch (e) {
    console.error(e);
  }
}

exports.deleteOrder = async (req, res) => {
  // not secure auth session! yet
  const { id } = req.params;
  await pool.query('UPDATE orders SET isDeleted=1 WHERE id=?', [id]);
  res.end(JSON.stringify({ result: 'success' }));
};

exports.getCarriages = async (req, res) => {
  const { id } = req.params;
  const carriages = await pool
    .query(
      `SELECT sc.* FROM searches_carriages sc,orders o WHERE o.id=? && o.search_id=sc.search_id ORDER BY sc.search_id ASC LIMIT 30`,
      [id]
    )
    .then((x) => x[0]);
  res.end(JSON.stringify({ carriages: carriages }));
};

exports.getOrders = async (req, res) => {
  const orders = await pool
    .query(
      `SELECT o.* FROM orders o WHERE o.isDeleted=0 ORDER BY o.id DESC LIMIT 0,90`,
      []
    )
    .then((x) => x[0]);

  const dummyEmailReturn = async (n, i) => {
    const sub = await pool
      .query(
        `SELECT ort.* FROM
      orders_routes ort WHERE ort.order_id=? && ort.carrier!='LAST_MILE' ORDER BY ort.id ASC`,
        [n.id]
      )
      .then((x) => x[0])
      .then(async (y) => {
        let dests = y;
        for (let j = 0; j < dests.length; j++) {
          dests[j] = dests[j];
          delete dests[j]['id'];
          delete dests[j]['order_id'];
          dests[j]['from'] = {
            city: dests[j]['fromCity'],
            country: dests[j]['fromCountry'],
            cors: {
              lat: parseFloat(dests[j]['fromCors'].split(',')[0]),
              lng: parseFloat(dests[j]['fromCors'].split(',')[1])
            }
          };
          delete dests[j]['fromCountry'];
          delete dests[j]['fromCity'];
          delete dests[j]['fromCors'];
          dests[j]['to'] = {
            city: dests[j]['toCity'],
            country: dests[j]['toCountry'],
            cors: {
              lat: parseFloat(dests[j]['toCors'].split(',')[0]),
              lng: parseFloat(dests[j]['toCors'].split(',')[1])
            }
          };
          delete dests[j]['toCountry'];
          delete dests[j]['toCity'];
          delete dests[j]['toCors'];
          const currencies = await getPrice();
          dests[j]['price'] = {
            eur: parseInt(dests[j]['price']),
            usd: parseInt(
              (
                (dests[j]['price'] * currencies.EUR.Value) /
                currencies.USD.Value
              ).toFixed(0)
            ),
            cny: parseInt(
              (
                (dests[j]['price'] * currencies.EUR.Value) /
                currencies.CNY.Value
              ).toFixed(0)
            ),
            rub: parseInt((dests[j]['price'] * currencies.EUR.Value).toFixed(0))
          };
          dests[j]['carrier'] = await pool
            .query(
              `SELECT s.id,s.slug,s.name FROM
            services s WHERE s.id=? LIMIT 1`,
              [dests[j]['carrier_id']]
            )
            .then((x) => x[0][0]);
          delete dests[j]['carrier_id'];
        }

        return dests;
      });
    let out = [];
    out[i] = n;
    out[i]['dests'] = sub;

    return out;
  };

  const promises = orders.map(async (x) => {
    const user = await dummyEmailReturn(x); // second promise

    const currencies = await getPrice();

    return {
      ...x,
      weight: parseFloat(x.weight),
      volume: parseFloat(x.volume),
      distance: parseInt(x.distance),
      duration: parseInt(x.duration),
      price: {
        eur: parseInt(x.price),
        usd: parseInt(
          ((x.price * currencies.EUR.Value) / currencies.USD.Value).toFixed(0)
        ),
        cny: parseInt(
          ((x.price * currencies.EUR.Value) / currencies.CNY.Value).toFixed(0)
        ),
        rub: parseInt((x.price * currencies.EUR.Value).toFixed(0))
      }
    };
  });
  const fresult = await Promise.all(promises);
  res.end(JSON.stringify({ orders: fresult }));
};

exports.saveOrder = async (req, res) => {
  const { form, route, searchId } = req.body;

  const insert = await pool.execute(
    'INSERT INTO orders(search_id,sh_email,sh_phone,sh_company,sh_zipcode,sh_address,sh_contacter,rec_email,rec_phone,rec_company,rec_zipcode,rec_address,rec_contacter,distance,duration,price,volume,weight) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
      searchId,
      form.sh_email || '',
      form.sh_phone || '',
      form.sh_company || '',
      form.sh_zipcode || '',
      form.sh_address || '',
      form.sh_contacter || '',
      form.rec_email || '',
      form.rec_phone || '',
      form.rec_company || '',
      form.rec_zipcode || '',
      form.rec_address || '',
      form.rec_contacter || '',
      route.distance || 0,
      route.duration || 0,
      route.price.eur || 0,
      route.volume || 0,
      route.weight || 0
    ]
  );

  const insert_id = insert[0].insertId;

  for (let i = 0; i < route.dests.length; i++) {
    await pool.execute(
      'INSERT INTO orders_routes(order_id,fromCity,fromCountry,toCity,toCountry,carrier_id,carrier,fromCors,toCors,distance,duration,price) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        insert_id,
        route.dests[i].from.city,
        route.dests[i].from.country,
        route.dests[i].to.city,
        route.dests[i].to.country,
        route.dests[i].carrier.service_id,
        route.dests[i].carrier.slug,
        route.dests[i].from.cors.lat + ',' + route.dests[i].from.cors.lng,
        route.dests[i].to.cors.lat + ',' + route.dests[i].to.cors.lng,
        route.dests[i].distance,
        route.dests[i].duration,
        route.dests[i].price.eur
      ]
    );
  }

  res.end(JSON.stringify({ result: 'success', order_id: insert_id }));
};
