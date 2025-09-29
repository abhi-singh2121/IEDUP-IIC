const express = require('express');
const router = express.Router();
const { sequelize, Sequelize } = require('../models/index');
const Incubation = require('../models/Incubation');
const PreIncubation = require('../models/PreIncubation');
const ContactMessage = require('../models/Contact');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// List registrations (paginated + filters)
router.get('/registrations', async (req, res) => {
  try {
    const { type = 'incubation', page = 1, pageSize = 25, sector, district, status } = req.query;
    const model = type === 'preincubation' ? PreIncubation : Incubation;
    const where = {};
    if (sector) where.sector = sector;
    if (district) where.district = district;
    if (status) where.status = status;
    const items = await model.findAll({
      where,
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
    });
    const total = await model.count({ where });
    res.json({ items, total });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'server error' });
  }
});

// Get single
router.get('/registrations/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const model = type === 'preincubation' ? PreIncubation : Incubation;
  const record = await model.findByPk(id);
  res.json({ record });
});

// Update
router.put('/registrations/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const model = type === 'preincubation' ? PreIncubation : Incubation;
  const payload = req.body;
  const updated = await model.update(payload, { where: { id } });
  res.json({ success: true });
});

// Change status
router.patch('/registrations/:type/:id/status', async (req, res) => {
  const { type, id } = req.params;
  const { status } = req.body;
  const model = type === 'preincubation' ? PreIncubation : Incubation;
  const updated = await model.update({ status }, { where: { id } });
  res.json({ success: true });
});

// Delete
router.delete('/registrations/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const model = type === 'preincubation' ? PreIncubation : Incubation;
  await model.destroy({ where: { id } });
  res.json({ success: true });
});

// Get contact messages (paged)
router.get('/contacts', async (req, res) => {
  const { page = 1, pageSize = 25 } = req.query;
  const items = await ContactMessage.findAll({
    order: [['createdAt', 'DESC']],
    offset: (page - 1) * pageSize,
    limit: Number(pageSize),
  });
  const total = await ContactMessage.count();
  res.json({ items, total });
});

// Reports: aggregated counts by sector or district
router.get('/reports', async (req, res) => {
  try {
    const { type = 'incubation', groupBy = 'sector' } = req.query;
    const model = type === 'preincubation' ? PreIncubation : Incubation;
    const results = await model.findAll({
      attributes: [
        groupBy,
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: [groupBy],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 200,
    });
    const aggregated = results.map(r => ({ label: r.get(groupBy), count: Number(r.get('count')) }));
    res.json({ aggregated });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'server error' });
  }
});

// Export CSV
router.get('/export', async (req, res) => {
  try {
    const { type = 'incubation' } = req.query;
    const model = type === 'preincubation' ? PreIncubation : Incubation;
    const items = await model.findAll({ order: [['createdAt', 'DESC']] });
    if (!items.length) return res.status(200).send('');
    const rows = items.map(i => i.toJSON());
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(',')]
      .concat(rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(',')))
      .join('\n');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`);
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
