$('#btn').click(function () {
    if ($('#sdate').val() && $('#edate').val() && $('#stime').val() && $('#etime').val()) {
        var moment = require('../browserify/plot_moment.js');
        const socket = io();
        const g1d = $("input[name='g1d']:checked").val();
        const g2d = $("input[name='g2d']:checked").val();
        const g3d = $("input[name='g3d']:checked").val();
        const g4d = $("input[name='g4d']:checked").val();
        const g5d = $("input[name='g5d']:checked").val();
        const g6d = $("input[name='g6d']:checked").val();
        const g7d = $("input[name='g7d']:checked").val();
        const sdate = $('#sdate').val();
        const edate = $('#edate').val();
        const stime = $('#stime').val();
        const etime = $('#etime').val();
        const g1t = $("input[name='g1t']:checked").val();
        const start = moment(sdate);
        const end = moment(edate);
        const ci = $('#hp').val();
        const darray = [];
        const validDays = [g1d,g2d,g3d,g4d,g5d,g6d,g7d];
        start.subtract(1, 'days');
        end.add(1, 'days');
        const days = [];
        for (var i = 0; i < 7; i++) {
            const string = validDays[i];
            if (string !== '') {
                days.push(parseInt(string));
            }
        }
        for (var i = 0; i < days.length; i++) {
            var stmp = start.clone().day(days[i]);
            if (stmp.isAfter(start, 'd') && stmp.isBefore(end, 'd')) {
                darray.push([stmp.clone().format('YYYY-MM-DD'), days[i]]);
            }
            stmp = start.clone();
            while (stmp.day(7 + days[i]).isBefore(end)) {
                darray.push([stmp.clone().format('YYYY-MM-DD'), days[i]]);
            }
        }
        var parray = [];
        if (stime === '00:00' && etime === '23:00') {
            var aux = [];
            for (let i = 0; i < darray.length; i++) {
                aux = [];
                aux.push(darray[i][0]);
                parray.push([aux,darray[i][1]]);
            }
        }
        else {
            var rhours = moment.range(sdate + "T" + stime + ':00', sdate + "T" + etime + ':00');
            var arhours = Array.from(rhours.by('hour'));
            const harray = arhours.map(m => m.format('HH'));
            for (let i = 0; i < darray.length; i++) {
                var auxarray = [];
                rex = '';
                for (let j = 0; j < harray.length; j++) {
                    auxarray.push(rex.concat(darray[i][0]+' '+ harray[j]));
                }
                parray.push([auxarray,darray[i][1]]);
            }
        }
        socket.emit('ploting', parray,ci,g1t)
        socket.on('ploting', (data) => {
            console.log(data);
        });
    } else {
        alert("Llene los datos");
    }
});