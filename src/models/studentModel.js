const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    rollNo : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    subject : [{
        name : {
            type : String,
            required : true
        },
        marks : {
            type : Number,
            required : true
        }
    }]
}, {strict:false})

module.exports = mongoose.model('studentRecords', studentSchema)