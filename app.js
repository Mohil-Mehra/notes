const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    fs.readdir('./files', (err, data) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Error loading notes");
        }
        res.render('index', { files: data });
    });
});


app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new-note', (req, res) => {
    const fileName = `${req.body.fileName}`;
    const content = req.body.noteContent;

    fs.writeFile(`./files/${fileName}.txt`, content, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error saving note");
        }
        res.redirect('/');
    });
});


app.get('/show/:fileName', (req, res) => {
    const fileName = `${req.params.fileName}.txt`; 
    const filePath = path.join(__dirname, 'files', fileName);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).send("File not found");
        }
        res.render('show', { fileName: req.params.fileName, content: data });
    });
});


app.get('/edit/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'files', `${fileName}.txt`);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).send("File not found");
        }
       
        res.render('edit', { fileName, noteContent: data });
    });
});

app.post('/edit/:fileName', (req, res) => {
    const oldFileName = req.params.fileName;
    const newFileName = req.body.newfileName;
    const content = req.body.noteContent;

    const oldFilePath = path.join(__dirname, 'files', `${oldFileName}.txt`);
    const newFilePath = path.join(__dirname, 'files', `${newFileName}.txt`);

    // Rename the file
    fs.rename(oldFilePath, newFilePath, (renameErr) => {
        if (renameErr) {
            console.error("Error renaming file:", renameErr);
            return res.status(500).send("Error renaming file");
        }

        // Write new content to the renamed file
        fs.writeFile(newFilePath, content, (writeErr) => {
            if (writeErr) {
                console.error("Error writing to file:", writeErr);
                return res.status(500).send("Error saving file content");
            }
            res.redirect('/');
        });
    });
});





app.get('/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName; 
    const filePath = path.join(__dirname, 'files', `${fileName}.txt`);
    fs.unlink(filePath, (err) => {
       
        res.redirect('/');
    });
});









app.listen(3000, () => {
    
});
