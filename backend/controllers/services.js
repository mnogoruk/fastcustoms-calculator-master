const pool = require('../dbconfig');

exports.getServices = async (req, res) => {
  let services = await pool.query(`SELECT s.*,
    IF(!s.parent,(SELECT COUNT(*) FROM services sc WHERE s.id=sc.parent),-1) total_services FROM
    services s ORDER BY s.id ASC`);
  services = services[0];

  res.end(JSON.stringify({ services: services }));
};

exports.getService = async (req, res) => {
  const { id } = req.params;

  let service = await pool
    .query(
      `SELECT s.*,
    IF(!s.parent,(SELECT COUNT(*) FROM services sc WHERE s.id=sc.parent),-1) total_services FROM
    services s WHERE s.id=? ORDER BY s.id ASC`,
      [id]
    )
    .then((x) => x[0][0]);

  let services = await pool
    .query(
      `SELECT s.*,
    IF(!s.parent,(SELECT COUNT(*) FROM services sc WHERE s.id=sc.parent),-1) total_services FROM
    services s WHERE s.parent=? ORDER BY s.id ASC`,
      [id]
    )
    .then((x) => x[0]);

  service['services'] = services;

  res.end(JSON.stringify({ service: service }));
};

exports.postService = async (req, res) => {
  const { service, id } = req.body;

  if (id === 'add') {
    const insert = await pool.execute(
      'INSERT INTO services(parent,slug,name,rate,transaction,ratio) VALUES(?,?,?,?,?,?)',
      [
        service.parent,
        service.slug || 'UNIQUE_NOT_VALID',
        service.name,
        service.rate,
        service.transaction,
        service.ratio
      ]
    );
    const insert_id = insert[0].insertId;
  } else {
    await pool.query(
      'UPDATE services SET parent=?,slug=?,name=?,rate=?,transaction=?,ratio=? WHERE id=?',
      [
        service.parent,
        service.slug || 'UNIQUE_NOT_VALID',
        service.name,
        service.rate,
        service.transaction,
        service.ratio,
        parseInt(id)
      ]
    );
  }

  res.end(JSON.stringify({ result: 'success' }));
};

exports.deleteService = async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM services WHERE id=?', [id]);
  await pool.query('DELETE FROM routes_services WHERE service_id=?', [id]);

  res.end(JSON.stringify({ result: 'success' }));
};
