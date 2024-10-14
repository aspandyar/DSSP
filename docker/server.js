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

app.post('/upload', (req, res, next) => {
    upload.single('fragment')(req, res, (err) => {
        if (err) return next(err); // Handle multer errors
        
        const fragmentId = req.body.id;
        if (!fragmentId) {
            return res.status(400).send('Fragment ID is required.');
        }

        // Log the request body to a file for debugging
        fs.appendFile('request_log.txt', JSON.stringify(req.body) + '\n', (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });

        const filename = `fragment_${fragmentId}.enc`;
        fs.rename(req.file.path, `uploads/${filename}`, (renameErr) => {
            if (renameErr) {
                return res.status(500).send('Error renaming the file.');
            }
            res.send(`File uploaded as ${filename}. Request body: ${JSON.stringify(req.body)}`);
        });
    });
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
