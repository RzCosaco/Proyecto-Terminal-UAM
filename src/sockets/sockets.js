module.exports = io => {
    io.on('connection', socket => {
        socket.on('ploting_mun', async (data, city, type) => {
            const model = require('../models/' + city);
            if (city === 'cdmx') {
                let datos = require('../resources/json/alcaldias.json');
                const ray = require('../resources/functions/rayCasting.js');
                var alertas = ["POLICE", "HAZARD", "JAM", "CHIT_CHAT", "ACCIDENT", "ROAD_CLOSED"];
                if (alertas.includes(type)) {
                    for (let i = 0; i < data.length; i++) {
                        var re = new RegExp(data[i][0].join("|"));
                        model.aggregate([
                            { $match: { "startTime": { $regex: re }, "alerts.type": type } },
                            { $project: { "alerts": { $filter: { input: "$alerts", as: "alert", cond: { $eq: ["$$alert.type", type] } } } } },
                            { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                            { $unwind: "$alerts" },
                            { $group: { _id: { "uuid": "$alerts.uuid" }, "c": { $addToSet: "$alerts.location" } } },
                            { $project: { _id: 0, "c": 1 } }
                        ]).
                            exec(function (err, response) {
                                if (err) return handleError(err);
                                if (response.length > 0) {
                                    var resjson = {
                                        "Alvaro Obregon": 0,
                                        "Azcapotzalco": 0,
                                        "Benito Juárez": 0,
                                        "Coyoacan": 0,
                                        "Cuajimalpa": 0,
                                        "Cuauhtemoc": 0,
                                        "Gustavo A. Madero": 0,
                                        "Iztacalco": 0,
                                        "Iztapalapa": 0,
                                        "La Magdalena Contreras": 0,
                                        "Miguel Hidalgo": 0,
                                        "Milpa Alta": 0,
                                        "Tlahuac": 0,
                                        "Tlalpan": 0,
                                        "Venustiano Carranza": 0,
                                        "Xochimilco": 0
                                    }
                                    datos.alcaldias.forEach(alcaldia => {
                                        response.forEach(element => {
                                            var check = [element.c[0].x, element.c[0].y]
                                            if (ray.contains(alcaldia.coordinates, check)) {
                                                resjson[alcaldia.name] = resjson[alcaldia.name] + 1;
                                            }
                                        });
                                    });
                                    socket.emit('ploting_mun', resjson);
                                }
                            });
                    }
                }
            }
        });
        socket.on('ploting_day', async (data, city, type) => {
            const model = require('../models/' + city);
            if (city === 'cdmx') {
                var alertas = ["POLICE", "HAZARD", "JAM", "CHIT_CHAT", "ACCIDENT", "ROAD_CLOSED"];
                if (alertas.includes(type)) {
                    for (let i = 0; i < data.length; i++) {
                        var re = new RegExp(data[i][0].join("|"));
                        model.aggregate([
                            { $match: { "startTime": { $regex: re }, "alerts.type": type } },
                            { $project: { "alerts": { $filter: { input: "$alerts", as: "alert", cond: { $eq: ["$$alert.type", type] } } } } },
                            { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                            { $unwind: "$alerts" },
                            { $group: { _id: { "uuid": "$alerts.uuid" }, "c": { $addToSet: "$alerts.location" }, "count": { $sum: 1 } } },
                            { $match: { count: { $gt: 0 } } },
                            { $count: "count" }
                        ]).
                            exec(function (err, response) {
                                if (err) return handleError(err);
                                var json = { "day": data[i][1] }
                                response.push(json);
                                socket.emit('ploting_day', response);
                            });
                    }
                }
            }
        });
    });
}