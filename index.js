const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const { z } = require('zod');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const MI_API_KEY = process.env.MI_API_KEY;

const useSsl = process.env.DB_SSL === 'true';
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 21212,
    ssl: useSsl ? { rejectUnauthorized: false } : false
});

app.use(cors());
app.use(express.json());

const verificarApiKey = (req, res, next) => {
    const apiKeyRecibida = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKeyRecibida || apiKeyRecibida !== MI_API_KEY) {
        return res.status(401).json({ error: 'Access denied. Invalid API key.' });
    }
    next();
};

app.get('/api/zip/:code', verificarApiKey, async (req, res) => {
    const zipSchema = z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format');
    const parsed = zipSchema.safeParse(req.params.code);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid zip code format', details: parsed.error.errors });
    }
    const code = parsed.data;

    try {
        const query = 'SELECT city, state_name FROM uszips WHERE zip = $1';

        const result = await pool.query(query, [code]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Zip code not found' });
        }

        const data = result.rows[0];
        res.json({
            zip: code,
            ciudad: data.city,
            estado: data.state_name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});