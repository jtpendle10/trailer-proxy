const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://lineage.api.ndustrial.io/graphql';
const FALLBACK_API_TOKEN = 'token niou_YkiaMScYAxbh4fwn3Mx2Hpzeh3n9Va5UBVSW';

app.post('/proxy', async (req, res) => {
    try {
        console.log('🚀 Incoming request body:', req.body);
        console.log('🚀 Incoming headers:', req.headers);

        const authHeader = req.headers['authorization'] || FALLBACK_API_TOKEN;

        const upstreamResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(req.body)
        });

        const data = await upstreamResponse.json();

        console.log('✅ Upstream API response:', data);

        res.json(data);
    } catch (error) {
        console.error('❌ Proxy error:', error);
        res.status(500).json({ error: 'Proxy server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
