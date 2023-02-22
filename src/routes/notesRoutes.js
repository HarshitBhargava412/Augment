const express = require("express");
const auth = require( "../auth" );
const { updateNote, deleteNote, createNote, getNotes, getAllNotes } = require( "../Controllers/notesController" );
const notesRouter = express.Router();

notesRouter.get("/all", auth, getAllNotes)

notesRouter.get("/", auth, getNotes);

notesRouter.post("/", auth, createNote);

notesRouter.delete("/:id", auth, deleteNote);

notesRouter.put("/:id", auth, updateNote);

module.exports = notesRouter;