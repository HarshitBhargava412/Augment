const notesModel = require( "../Models/notesModel" );

const createNote = async (req, res) => {
    const {title, description} = req.body;

    const newNote = new notesModel({
        title: title,
        description: description,
        userId: req.userId
    });

    await newNote.save();
    res.status(201).json(newNote);
}

const updateNote = async (req, res) => {
    const id = req.params.id;
    const {title, description} = req.body;

    const newNote = {
        title: title,
        description: description,
        userId: req.userId
    }

    await notesModel.findByIdAndUpdate(id, newNote, {new: true});
    res.status(200).json(newNote);
}

const deleteNote = async (req, res) => {
    const id = req.params.id;
    
    const note = await notesModel.findByIdAndRemove(id);
    res.status(202).json(note);
}

const getNotes = async (req, res) => {
    const pageNumber = req.query.page;
    let notes;
    if(req.role === 0) {
        notes = await notesModel.find().skip(10 * pageNumber).limit(10);
    } else {
        notes = await notesModel.find({userId: req.userId}).skip(10 * pageNumber).limit(10);
    }
    res.status(200).json(notes);
}

const getAllNotes = async (req, res) => {
    const notes = await notesModel.find();
    res.status(200).json(notes);
}

module.exports = {createNote, updateNote, deleteNote, getNotes, getAllNotes};