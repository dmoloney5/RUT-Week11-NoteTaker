// Dependencies
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

//For the Port Number
const PORT = process.env.PORT || 3001;

//Variable for the JSON file
const allNotes = require('./db/db.json');

//Use statements for the app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Get Function
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//Creating New Note
function createNewNote(body, notesArr) {
    const newNote = body;
    if (!Array.isArray(notesArr))
        notesArr = [];

    if (notesArr.length === 0)
        notesArr.push(0);

    body.id = notesArr[0];
    notesArr[0]++;

    notesArr.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ newNote: notesArr }, null, 2)
    );
    return newNote;
}

//Post the note into JSON
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

//Delete a Note
function deleteNote(id, notesArr) {
    for (let i = 0; i < notesArr.length; i++) {
        let note = notesArr[i];

        if (note.id == id) {
            notesArr.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArr, null, 2)
            );


        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

//to apply the port to http://localhost
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});