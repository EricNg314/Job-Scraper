var mongoose = require("mongoose");

//Creating schema constructor.
var Schema = mongoose.Schema;

//Creating a NoteSchema using constructor.
var NoteSchema = new Schema({
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;