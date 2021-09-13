const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TaskSchema = new schema({
},{ collection : 'paris' })

module.exports = mongoose.model('paris',TaskSchema)