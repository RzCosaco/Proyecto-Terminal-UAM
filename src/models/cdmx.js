const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TaskSchema = new schema({
},{ collection : 'cdmx' })

module.exports = mongoose.model('cdmx',TaskSchema)