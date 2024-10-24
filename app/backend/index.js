const express = require('express');
require('dotenv').config();  // Load env vars
const serverRoutes = require('./server/routes');
const app = express();

// Middleware
app.use(express.json());

app.use('/api/server', serverRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
