var mongoose = require("mongoose");

//Creating schema constructor.
var Schema = mongoose.Schema;

//Creating a NoteSchema using constructor.
var JobSchema = new Schema({
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
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

});

var Job = mongoose.model("Job", JobSchema);

module.exports = Job;