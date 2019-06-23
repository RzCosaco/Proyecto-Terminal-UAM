$('#btn').click(function(){
    const socket = io();
    const g1d = $('[name="g1d"]').val();
    const g2d = $('[name="g2d"]').val();
    const g3d = $('[name="g3d"]').val();
    const g4d = $('[name="g4d"]').val();
    const g5d = $('[name="g5d"]').val();
    const g6d = $('[name="g6d"]').val();
    const g7d = $('[name="g7d"]').val();
    const sdate = $('#sdate').val();
    const edate = $('#edate').val();
    const stime = $('#stime').val();
    const etime = $('#etime').val();
    const g1t = $('#g1t').val();
    //const Moment = require('moment');
    //const MomentRange = require('moment-range');
    //const moment = MomentRange.extendMoment(Moment);
    socket.emit('ploting',g1d,g2d,g3d,g4d,g5d,g6d,g7d);
    socket.on('ploting',(data) =>{
        console.log(data);
    });
});