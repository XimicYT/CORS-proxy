const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS so your local HTML file can read the output
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle browser preflight checks
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing "url" parameter.');
    }

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 8000
        });
        
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send(`Proxy failed to fetch target: ${error.message}`);
    }
};
