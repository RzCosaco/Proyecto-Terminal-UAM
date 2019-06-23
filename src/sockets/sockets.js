module.exports = io =>{
    io.on('connection',socket=>{
        //console.log('new user connected');
        socket.on('ploting',(g1d,g2d,g3d,g4d,g5d,g6d,g7d) =>{
            console.log(g1d+' '+g2d+' '+g3d+' '+g4d+' '+g5d+' '+g6d+' '+g7d+' '+socket.id);
            io.to(socket.id).emit('ploting', 'ploteando');
        });
    });
}