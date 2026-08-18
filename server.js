const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;


// Allow your local HTML file to talk to this server
app.use(cors());

// The endpoint your HTML will call
app.get('/fetch-site', async (req, res) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).send('Missing "url" query parameter.');
    }

    try {
        // Fetch the site using a real browser User-Agent so sites don't block it
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 8000 // 8 second timeout
        });
        
        // Send the raw HTML text straight back to your frontend
        res.send(response.data);
    } catch (error) {
        res.status(500).send(`Server failed to fetch target: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Backend proxy running smoothly at http://localhost:${PORT}`);
});
