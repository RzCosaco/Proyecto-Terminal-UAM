module.exports = io => {
    io.on('connection', socket => {
        //console.log('new user connected');
        socket.on('ploting', async (data, city, type) => {
            const model = require('../models/' + city);
            if (city === 'cdmx') {
                let datos = require('../resources/json/alcaldias.json');
                const ray = require('../resources/functions/rayCasting.js');
                var alertas = ["POLICE", "HAZARD", "JAM", "CHIT-CHAT", "ACCIDENT", "ROAD_CLOSED"];
                if (alertas.includes(type)) {
                    for (let i = 0; i < data.length; i++) {
                        var resjson = [];
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
                                    io.to(socket.id).emit('ploting', resjson);
                                }
                            });
                    }
                }
            }
        });
    });
}