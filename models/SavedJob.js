var mongoose = require("mongoose");

//Creating schema constructor.
var Schema = mongoose.Schema;

//Creating a NoteSchema using constructor.
var SavedJobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    location: {
        type: String,
        required: true
    },    
    saved: {
        type: Boolean,
        default: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

});

var SavedJob = mongoose.model("SavedJob", SavedJobSchema);

module.exports = SavedJob;