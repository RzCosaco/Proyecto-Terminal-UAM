const socket = io();
var lbls = [];
var chartDatos = [];
var lbl = '';
function draw(lbls,chartDatos,lbl) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lbls,
            datasets: [{
                label: lbl,
                data: chartDatos,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 18
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    return myChart;
}

var myChart = draw(lbls,chartDatos,lbl);

$('#btn').click(function () {
    if ($('#sdate').val() && $('#edate').val() && $('#stime').val() && $('#etime').val()) {
        var lbls = [];
        var chartDatos = [];
        var lbl = '';
        myChart.destroy();
        myChart = draw(lbls,chartDatos,lbl);
        $("#btn").attr("disabled", true);
        var moment = require('../browserify/plot_moment.js');
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
        const g2t = $("input[name='g2t']:checked").val();
        const start = moment(sdate);
        const end = moment(edate);
        const ci = $('#hp').val();
        const darray = [];
        const validDays = [g1d, g2d, g3d, g4d, g5d, g6d, g7d];
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
                parray.push([aux, darray[i][1]]);
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
                    auxarray.push(rex.concat(darray[i][0] + ' ' + harray[j]));
                }
                parray.push([auxarray, darray[i][1]]);
            }
        }
        if (g2t === 'day') {
            lbls = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            for (let i = 0; i < lbls.length; i++) {
                chartDatos.push(0);
            }
            var cont = 0;
            myChart.data.labels = lbls;
            myChart.data.datasets[0].label = ("Promedio de "+g1t);
            var cuantos = [0,0,0,0,0,0,0];
            myChart.update();
            socket.emit('ploting_day', parray, ci, g1t)
            socket.on("disconnect", (reason) => {
                console.log(reason);
              });
            socket.on('ploting_day', (resjson) => {
                cont += 1;
                switch (resjson[1].day) {
                    case 0:
                        cuantos[0] = cuantos[0] + 1;
                        myChart.data.datasets[0].data[0] = myChart.data.datasets[0].data[0] + resjson[0].count;
                        break;
                    case 1:
                        cuantos[1] = cuantos[1] + 1;
                        myChart.data.datasets[0].data[1] = myChart.data.datasets[0].data[1] + resjson[0].count;
                        break;
                    case 2:
                        cuantos[2] = cuantos[2] + 1;
                        myChart.data.datasets[0].data[2] = myChart.data.datasets[0].data[2] + resjson[0].count;
                        break;
                    case 3:
                        cuantos[3] = cuantos[3] + 1;
                        myChart.data.datasets[0].data[3] = myChart.data.datasets[0].data[3] + resjson[0].count;
                        break;
                    case 4:
                        cuantos[4] = cuantos[4] + 1;
                        myChart.data.datasets[0].data[4] = myChart.data.datasets[0].data[4] + resjson[0].count;
                        break;
                    case 5:
                        cuantos[5] = cuantos[5] + 1;
                        myChart.data.datasets[0].data[5] = myChart.data.datasets[0].data[5] + resjson[0].count;
                        break;
                    case 6:
                        cuantos[6] = cuantos[6] + 1;
                        myChart.data.datasets[0].data[6] = myChart.data.datasets[0].data[6] + resjson[0].count;
                        break;
                }
                if (cont === parray.length) {
                    for (let i = 0; i < 7; i++) {
                        myChart.data.datasets[0].data[i] = myChart.data.datasets[0].data[i] / cuantos[i];
                    }
                    $("#btn").attr("disabled", false);
                }
                myChart.update();
            });
        }
        else if (g2t === 'mun') {
            lbls = ["Alvaro Obregon",
                "Azcapotzalco",
                "Benito Juárez",
                "Coyoacan",
                "Cuajimalpa",
                "Cuauhtemoc",
                "Gustavo A. Madero",
                "Iztacalco",
                "Iztapalapa",
                "La Magdalena Contreras",
                "Miguel Hidalgo",
                "Milpa Alta",
                "Tlahuac",
                "Tlalpan",
                "Venustiano Carranza",
                "Xochimilco"];
            for (let i = 0; i < lbls.length; i++) {
                chartDatos.push(0);
            }
            var cont = 0;
            myChart.data.labels = lbls;
            myChart.data.datasets[0].label = ("Promedio de "+g1t);
            myChart.update();
            socket.emit('ploting_mun', parray, ci, g1t)
            socket.on("disconnect", (reason) => {
                console.log(reason);
              });
            socket.on('ploting_mun', (resjson) => {
                cont += 1;
                for (x in resjson) {
                    switch (x) {
                        case "Alvaro Obregon":
                            myChart.data.datasets[0].data[0] = myChart.data.datasets[0].data[0] + resjson[x];
                            break;
                        case "Azcapotzalco":
                            myChart.data.datasets[0].data[1] = myChart.data.datasets[0].data[1] + resjson[x];
                            break;
                        case "Benito Juárez":
                            myChart.data.datasets[0].data[2] = myChart.data.datasets[0].data[2] + resjson[x];
                            break;
                        case "Coyoacan":
                            myChart.data.datasets[0].data[3] = myChart.data.datasets[0].data[3] + resjson[x];
                            break;
                        case "Cuajimalpa":
                            myChart.data.datasets[0].data[4] = myChart.data.datasets[0].data[4] + resjson[x];
                            break;
                        case "Cuauhtemoc":
                            myChart.data.datasets[0].data[5] = myChart.data.datasets[0].data[5] + resjson[x];
                            break;
                        case "Gustavo A. Madero":
                            myChart.data.datasets[0].data[6] = myChart.data.datasets[0].data[6] + resjson[x];
                            break;
                        case "Iztacalco":
                            myChart.data.datasets[0].data[7] = myChart.data.datasets[0].data[7] + resjson[x];
                            break;
                        case "Iztapalapa":
                            myChart.data.datasets[0].data[8] = myChart.data.datasets[0].data[8] + resjson[x];
                            break;
                        case "La Magdalena Contreras":
                            myChart.data.datasets[0].data[9] = myChart.data.datasets[0].data[9] + resjson[x];
                            break;
                        case "Miguel Hidalgo":
                            myChart.data.datasets[0].data[10] = myChart.data.datasets[0].data[10] + resjson[x];
                            break;
                        case "Milpa Alta":
                            myChart.data.datasets[0].data[11] = myChart.data.datasets[0].data[11] + resjson[x];
                            break;
                        case "Tlahuac":
                            myChart.data.datasets[0].data[12] = myChart.data.datasets[0].data[12] + resjson[x];
                            break;
                        case "Tlalpan":
                            myChart.data.datasets[0].data[13] = myChart.data.datasets[0].data[13] + resjson[x];
                            break;
                        case "Venustiano Carranza":
                            myChart.data.datasets[0].data[14] = myChart.data.datasets[0].data[14] + resjson[x];
                            break;
                        case "Xochimilco":
                            myChart.data.datasets[0].data[15] = myChart.data.datasets[0].data[15] + resjson[x];
                            break;
                        default:
                            return integer;
                    }
                }
                if (cont === parray.length) {
                    for (let i = 0; i < 16; i++) {
                        myChart.data.datasets[0].data[i] = myChart.data.datasets[0].data[i] / parray.length;
                    }
                    $("#btn").attr("disabled", false);
                }
                myChart.update();
            });
        }

    } else {
        alert("Llene los datos");
    }
});