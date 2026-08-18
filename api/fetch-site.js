const axios = require('axios');

module.exports = async (req, res) => {
    // Set permissive backend CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            timeout: 10000
        });

        let html = response.data;
        const baseUrl = new URL(targetUrl);

        // 1. Strip out Meta Content Security Policies before it hits the browser
        html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '');

        // 2. Force inject a valid base href at the absolute top of the head block
        const baseTag = `<base href="${baseUrl.origin}${baseUrl.pathname}">`;
        html = html.replace(/<head>/i, `<head>${baseTag}`);

        // Send the modified, stripped document structure
        res.status(200).send(html);
    } catch (error) {
        res.status(500).send(`Server Proxy failed to process site target: ${error.message}`);
    }
};
