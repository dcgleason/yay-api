var mongoose = require('mongoose');
const Schema = mongoose.Schema

var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image