const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

// Setup storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `fragment_${req.body.id}.enc`); // Naming the file based on the fragment ID
    },
});

const upload = multer({ storage });

// Serve the uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the upload middleware to handle the file upload
app.post('/upload', upload.single('fragment'), (req, res) => {
    const fragmentId = req.body.id; // Accessing the ID from the request

    if (!fragmentId) {
        return res.status(400).send('Fragment ID is required.'); // Error if ID is not provided
    }

    if (!req.file) {
        return res.status(400).send('No file uploaded.'); // Error if no file is provided
    }

    // Successful response
    res.send(`File uploaded as fragment_${fragmentId}.enc`);
});

// GET endpoint to download a fragment
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
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
