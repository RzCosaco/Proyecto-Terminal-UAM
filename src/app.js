const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const app = express();

//connecting to db
mongoose.connect('mongodb://localhost/wazeproyecto', {useNewUrlParser: true})
.then(db => console.log('DB conectada'))
.catch(err => console.log(err));

//importing routes
const indexRoutes = require('./routes/index');

//settings
app.set('port', process.env.PORT || 5000);
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

//starting server
const server = app.listen(app.get('port'),() => {
    console.log(`Server on port ${app.get('port')}`);
});

//webSockets
const io = socketIO(server, { pingTimeout: 300000 });
//routes
require('./sockets/sockets')(io);
app.use('/',indexRoutes);
app.use("/resources", express.static(__dirname + '/resources'));
app.use("/views/javascript_ejs", express.static(__dirname + '/views/javascript_ejs'));