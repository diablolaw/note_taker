const express = require("express");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const { json } = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a review`);

  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: randomUUID(),
    };
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("successfully updated notes!")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting notes");
  }
});
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
