const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `fragment_${req.body.id}.enc`);
    },
});

const upload = multer({ storage });

// Serve the uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the upload middleware to handle the file upload
app.post('/upload', upload.single('fragment'), (req, res) => {
    const fragmentId = req.body.id;

    // Log the request body to a file for debugging
    fs.appendFile('request_log.txt', JSON.stringify(req.body) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    if (!fragmentId) {
        return res.status(400).send('Fragment ID is required.'); 
    }

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    res.send(`File uploaded as fragment_${fragmentId}.enc`);
});

// GET endpoint to download a fragment
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
