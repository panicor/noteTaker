const fs = require("fs");
const path = require("path");
const router = require("express").Router();
const notesDB = "./db/db.json"
const uuid = require("../helpers/uuid.js")
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils.js")

//  GET  /api/notes
router.get("/notes", (req, res) => {
    console.info(`${req.method} request recieved`);
    readFromFile(notesDB)
    .then((notes) => res.json(JSON.parse(notes)));
})

// `POST /api/notes` should receive a new note to save on the request body,
router.post('/notes', (req,res)=> {
    console.info(`${req.method} request recieved`);
    const { title, content, id } = req.body;
    
    if (req.body){
        const newNote = { title, content, id: uuid()}

        readAndAppend(newNote, notesDB);
        res.json("New note added")
    }
    else{
        res.error("There was an error")
    }
  
})


router.delete("/notes/:id", (req, res) => {
    let newContent = fs.readFileSync(notesDB);
    let notes = JSON.parse(newContent);
    const notesFilt = notes.filter(item => item.id != req.params.id)
    writeToFile(notesDB, notesFilt);
    res.json({ success : true });
})




module.exports = router;