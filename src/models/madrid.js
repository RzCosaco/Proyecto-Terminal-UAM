const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TaskSchema = new schema({
},{ collection : 'madrid' })

module.exports = mongoose.model('madrid',TaskSchema)