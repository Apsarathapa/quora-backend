const mongoose = require('mongoose');

// Define the Question schema
const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Question must have a title
    },
    description: {
        type: String,
        required: true // Question must have a description/body
    },
    tags: {
        type: [String], // Array of tags like ['JavaScript', 'Node.js']
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically adds the current date/time
    }
});



// Export the model
module.exports = mongoose.model('Question', questionSchema);

