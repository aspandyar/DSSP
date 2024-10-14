const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Setup multer for saving files
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('fragment'), (req, res) => {
    const fragment = req.file;
    const fragmentId = req.body.id;
    const dest = path.join(__dirname, 'uploads', `fragment_${fragmentId}.enc`);
    fs.renameSync(fragment.path, dest);
    res.sendStatus(200);
});

const port = 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
