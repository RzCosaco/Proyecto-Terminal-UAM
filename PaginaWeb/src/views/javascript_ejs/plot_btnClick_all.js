let lbls = [];
let chartDatos = [];
let lbl = '';
function draw(lbls, chartDatos, lbl) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lbls,
            datasets: [{
                label: lbl,
                data: chartDatos,
                backgroundColor: '#003399',
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 0.5
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 13,
                },
                position: 'bottom'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    categoryPercentage: 1.0,
                    barPercentage: 1.0,
                    ticks: {
                        fontColor: "white",
                        fontSize: 16,
                        beginAtZero: true,
                        autoSkip: false,
                        padding:15
                    }
                }]
            },
            plugins: {
                datalabels: {
                  anchor: 'center',
                  align: 'center',
                  color: 'white',
                  rotation: 270,
                  font: {
                    weight: 'bold',
                    size: 20
                  }
                }
              }
        }
    });
    return myChart;
}

let myChart = draw(lbls, chartDatos, lbl);

$('#btn').click(function () {
    if ($('#sdate').val() && $('#edate').val() && $('#stime').val() && $('#etime').val()) {
        const socket = io();
        lbls = [];
        chartDatos = [];
        lbl = '';
        myChart.destroy();
        myChart = draw(lbls, chartDatos, lbl);
        $("#btn").attr("disabled", true);
        const moment = require('../browserify/plot_moment.js');
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
        const setime = $('#etime :selected').text();
        const g1t = $("input[name='g1t']:checked").val();
        const start = moment(sdate);
        const end = moment(edate);
        const ci = $('#hp').val();
        const darray = [];
        const validDays = [g1d, g2d, g3d, g4d, g5d, g6d, g7d];
        start.subtract(1, 'days');
        end.add(1, 'days');
        const days = [];
        for (let i = 0; i < 7; i++) {
            const string = validDays[i];
            if (string !== '') {
                days.push(parseInt(string));
            }
        }
        for (let i = 0; i < days.length; i++) {
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
        if (parray.length === 1 || days.length === 1) {
            lbls = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
            let numDias = 0;
            parray.forEach(element => {
                numDias += element[0].length;
            });
            let cont = 0;
            let cuantos = [];
            let total = [];
            cuantos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            myChart.data.labels = lbls;
            myChart.data.datasets[0].label = ("Promedio de " + g1t + " en " + ci.toUpperCase() + " del " + sdate + " al " + edate + " de " + stime + " a " + setime);
            myChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            myChart.update();
            socket.emit('ploting_oneDay', parray, ci, g1t)
            socket.on("disconnect", (reason) => {
                console.log(reason);
            });
            socket.on('ploting_oneDay', (resjson) => {
                cont += 1;
                switch (resjson[1].hr) {
                    case '00:00':
                        cuantos[0] = cuantos[0] + 1;
                        total[0] = total[0] + resjson[0].count;
                        myChart.data.datasets[0].data[0] = Math.round((total[0] / cuantos[0]) * 100) / 100;
                        break;
                    case '01:00':
                        cuantos[1] = cuantos[1] + 1;
                        total[1] = total[1] + resjson[0].count;
                        myChart.data.datasets[0].data[1] = Math.round((total[1] / cuantos[1]) * 100) / 100;
                        break;
                    case '02:00':
                        cuantos[2] = cuantos[2] + 1;
                        total[2] = total[2] + resjson[0].count;
                        myChart.data.datasets[0].data[2] = Math.round((total[2] / cuantos[2]) * 100) / 100;
                        break;
                    case '03:00':
                        cuantos[3] = cuantos[3] + 1;
                        total[3] = total[3] + resjson[0].count;
                        myChart.data.datasets[0].data[3] = Math.round((total[3] / cuantos[3]) * 100) / 100;
                        break;
                    case '04:00':
                        cuantos[4] = cuantos[4] + 1;
                        total[4] = total[4] + resjson[0].count;
                        myChart.data.datasets[0].data[4] = Math.round((total[4] / cuantos[4]) * 100) / 100;
                        break;
                    case '05:00':
                        cuantos[5] = cuantos[5] + 1;
                        total[5] = total[5] + resjson[0].count;
                        myChart.data.datasets[0].data[5] = Math.round((total[5] / cuantos[5]) * 100) / 100;
                        break;
                    case '06:00':
                        cuantos[6] = cuantos[6] + 1;
                        total[6] = total[6] + resjson[0].count;
                        myChart.data.datasets[0].data[6] = Math.round((total[6] / cuantos[6]) * 100) / 100;
                        break;
                    case '07:00':
                        cuantos[7] = cuantos[7] + 1;
                        total[7] = total[7] + resjson[0].count;
                        myChart.data.datasets[0].data[7] = Math.round((total[7] / cuantos[7]) * 100) / 100;
                        break;
                    case '08:00':
                        cuantos[8] = cuantos[8] + 1;
                        total[8] = total[8] + resjson[0].count;
                        myChart.data.datasets[0].data[8] = Math.round((total[8] / cuantos[8]) * 100) / 100;
                        break;
                    case '09:00':
                        cuantos[9] = cuantos[9] + 1;
                        total[9] = total[9] + resjson[0].count;
                        myChart.data.datasets[0].data[9] = Math.round((total[9] / cuantos[9]) * 100) / 100;
                        break;
                    case '10:00':
                        cuantos[10] = cuantos[10] + 1;
                        total[10] = total[10] + resjson[0].count;
                        myChart.data.datasets[0].data[10] = Math.round((total[10] / cuantos[10]) * 100) / 100;
                        break;
                    case '11:00':
                        cuantos[11] = cuantos[11] + 1;
                        total[11] = total[11] + resjson[0].count;
                        myChart.data.datasets[0].data[11] = Math.round((total[11] / cuantos[11]) * 100) / 100;
                        break;
                    case '12:00':
                        cuantos[12] = cuantos[12] + 1;
                        total[12] = total[12] + resjson[0].count;
                        myChart.data.datasets[0].data[12] = Math.round((total[12] / cuantos[12]) * 100) / 100;
                        break;
                    case '13:00':
                        cuantos[13] = cuantos[13] + 1;
                        total[13] = total[13] + resjson[0].count;
                        myChart.data.datasets[0].data[13] = Math.round((total[13] / cuantos[13]) * 100) / 100;
                        break;
                    case '14:00':
                        cuantos[14] = cuantos[14] + 1;
                        total[14] = total[14] + resjson[0].count;
                        myChart.data.datasets[0].data[14] = Math.round((total[14] / cuantos[14]) * 100) / 100;
                        break;
                    case '15:00':
                        cuantos[15] = cuantos[15] + 1;
                        total[15] = total[15] + resjson[0].count;
                        myChart.data.datasets[0].data[15] = Math.round((total[15] / cuantos[15]) * 100) / 100;
                        break;
                    case '16:00':
                        cuantos[16] = cuantos[16] + 1;
                        total[16] = total[16] + resjson[0].count;
                        myChart.data.datasets[0].data[16] = Math.round((total[16] / cuantos[16]) * 100) / 100;
                        break;
                    case '17:00':
                        cuantos[17] = cuantos[17] + 1;
                        total[17] = total[17] + resjson[0].count;
                        myChart.data.datasets[0].data[17] = Math.round((total[17] / cuantos[17]) * 100) / 100;
                        break;
                    case '18:00':
                        cuantos[18] = cuantos[18] + 1;
                        total[18] = total[18] + resjson[0].count;
                        myChart.data.datasets[0].data[18] = Math.round((total[18] / cuantos[18]) * 100) / 100;
                        break;
                    case '19:00':
                        cuantos[19] = cuantos[19] + 1;
                        total[19] = total[19] + resjson[0].count;
                        myChart.data.datasets[0].data[19] = Math.round((total[19] / cuantos[19]) * 100) / 100;
                        break;
                    case '20:00':
                        cuantos[20] = cuantos[20] + 1;
                        total[20] = total[20] + resjson[0].count;
                        myChart.data.datasets[0].data[20] = Math.round((total[20] / cuantos[20]) * 100) / 100;
                        break;
                    case '21:00':
                        cuantos[21] = cuantos[21] + 1;
                        total[21] = total[21] + resjson[0].count;
                        myChart.data.datasets[0].data[21] = Math.round((total[21] / cuantos[21]) * 100) / 100;
                        break;
                    case '22:00':
                        cuantos[22] = cuantos[22] + 1;
                        total[22] = total[22] + resjson[0].count;
                        myChart.data.datasets[0].data[22] = Math.round((total[22] / cuantos[22]) * 100) / 100;
                        break;
                    case '23:00':
                        cuantos[23] = cuantos[23] + 1;
                        total[23] = total[23] + resjson[0].count;
                        myChart.data.datasets[0].data[23] = Math.round((total[23] / cuantos[23]) * 100) / 100;
                        break;
                }
                if (cont === numDias) {
                    $("#btn").attr("disabled", false);
                }
                myChart.update();
            });
        }
        else {
            let cont = 0;
            let cuantos = [];
            let total = [];
            cuantos = [0, 0, 0, 0, 0, 0, 0];
            total = [0, 0, 0, 0, 0, 0, 0];
            lbls = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            myChart.data.labels = lbls;
            myChart.data.datasets[0].label = ("Promedio de " + g1t + " en " + ci.toUpperCase() + " del " + sdate + " al " + edate + " de " + stime + " a " + setime);
            myChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0];
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
                        total[0] = total[0] + resjson[0].count;
                        myChart.data.datasets[0].data[0] = Math.round((total[0] / cuantos[0]) * 100) / 100;
                        break;
                    case 1:
                        cuantos[1] = cuantos[1] + 1;
                        total[1] = total[1] + resjson[0].count;
                        myChart.data.datasets[0].data[1] = Math.round((total[1] / cuantos[1]) * 100) / 100;
                        break;
                    case 2:
                        cuantos[2] = cuantos[2] + 1;
                        total[2] = total[2] + resjson[0].count;
                        myChart.data.datasets[0].data[2] = Math.round((total[2] / cuantos[2]) * 100) / 100;
                        break;
                    case 3:
                        cuantos[3] = cuantos[3] + 1;
                        total[3] = total[3] + resjson[0].count;
                        myChart.data.datasets[0].data[3] = Math.round((total[3] / cuantos[3]) * 100) / 100;
                        break;
                    case 4:
                        cuantos[4] = cuantos[4] + 1;
                        total[4] = total[4] + resjson[0].count;
                        myChart.data.datasets[0].data[4] = Math.round((total[4] / cuantos[4]) * 100) / 100;
                        break;
                    case 5:
                        cuantos[5] = cuantos[5] + 1;
                        total[5] = total[5] + resjson[0].count;
                        myChart.data.datasets[0].data[5] = Math.round((total[5] / cuantos[5]) * 100) / 100;
                        break;
                    case 6:
                        cuantos[6] = cuantos[6] + 1;
                        total[6] = total[6] + resjson[0].count;
                        myChart.data.datasets[0].data[6] = Math.round((total[6] / cuantos[6]) * 100) / 100;
                        break;
                }
                if (cont === parray.length) {
                    $("#btn").attr("disabled", false);
                }
                myChart.update();
            });
        }
    } else {
        alert("Llene los datos");
    }
});