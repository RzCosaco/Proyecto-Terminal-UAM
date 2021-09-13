const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TaskSchema = new schema({
},{ collection : 'brasilia' })

module.exports = mongoose.model('brasilia',TaskSchema)