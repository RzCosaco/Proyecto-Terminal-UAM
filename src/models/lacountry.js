const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TaskSchema = new schema({
},{ collection : 'lacountry' })

module.exports = mongoose.model('lacountry',TaskSchema)