const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { city, zipcode, minPrice, maxPrice, beds, baths, limit, offset } = req.query;

    const parsedLimit = limit !== undefined ? parseInt(limit, 10) : 20;
    const parsedOffset = offset !== undefined ? parseInt(offset, 10) : 0;

    if (limit !== undefined && (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100)) {
      return res.status(400).json({ error: 'limit must be a positive number, 100 or less' });
    }
    if (offset !== undefined && (isNaN(parsedOffset) || parsedOffset < 0)) {
      return res.status(400).json({ error: 'offset must be zero or a positive number' });
    }
    if (minPrice !== undefined && isNaN(parseFloat(minPrice))) {
      return res.status(400).json({ error: 'minPrice must be a number' });
    }
    if (maxPrice !== undefined && isNaN(parseFloat(maxPrice))) {
      return res.status(400).json({ error: 'maxPrice must be a number' });
    }
    if (beds !== undefined && isNaN(parseInt(beds, 10))) {
      return res.status(400).json({ error: 'beds must be a number' });
    }
    if (baths !== undefined && isNaN(parseFloat(baths))) {
      return res.status(400).json({ error: 'baths must be a number' });
    }

    const conditions = [];
    const values = [];

    if (city) {
      conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
      values.push(city);
    }
    if (zipcode) {
      conditions.push('L_Zip = ?');
      values.push(zipcode);
    }
    if (minPrice !== undefined) {
      conditions.push('L_SystemPrice >= ?');
      values.push(parseFloat(minPrice));
    }
    if (maxPrice !== undefined) {
      conditions.push('L_SystemPrice <= ?');
      values.push(parseFloat(maxPrice));
    }
    if (beds !== undefined) {
      conditions.push('L_Keyword2 = ?');
      values.push(parseInt(beds, 10));
    }
    if (baths !== undefined) {
      conditions.push('LM_Dec_3 = ?');
      values.push(parseFloat(baths));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) AS total FROM rets_property ${whereClause}`;
    const [countRows] = await pool.query(countQuery, values);
    const total = countRows[0].total;

    const dataQuery = `SELECT * FROM rets_property ${whereClause} LIMIT ? OFFSET ?`;
    const dataValues = [...values, parsedLimit, parsedOffset];
    const [rows] = await pool.query(dataQuery, dataValues);

    res.status(200).json({
      total,
      limit: parsedLimit,
      offset: parsedOffset,
      results: rows
    });
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

module.exports = router;