const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TaskSchema = new schema({
},{ collection : 'abudhabi' })

module.exports = mongoose.model('abudhabi',TaskSchema)