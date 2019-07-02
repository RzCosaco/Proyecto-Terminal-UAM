module.exports = io => {
    io.on('connection', socket => {
        socket.on('ploting_mun', async (data, city, type) => {
            const model = require('../models/' + city);
            const datos = require('../resources/json/alcaldias.json');
            const ray = require('../resources/functions/rayCasting.js');
            var spawn = require("child_process").spawn;
            const alertas = ["POLICE", "HAZARD", "JAM", "CHIT_CHAT", "ACCIDENT", "ROAD_CLOSED"];
            if (alertas.includes(type)) {
                for (let i = 0; i < data.length; i++) {
                    let re = new RegExp(data[i][0].join("|"));
                    await model.aggregate([
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
                                var resjson = { "Alvaro Obregon": 0, "Azcapotzalco": 0, "Benito Juarez": 0, "Coyoacan": 0, "Cuajimalpa": 0, "Cuauhtemoc": 0, "Gustavo A. Madero": 0, "Iztacalco": 0, "Iztapalapa": 0,"La Magdalena Contreras": 0,"Miguel Hidalgo": 0,"Milpa Alta": 0,"Tlahuac": 0,"Tlalpan": 0,"Venustiano Carranza": 0,"Xochimilco": 0, "No Found": 0 };
                                var process = spawn("java", ["-jar", 'D:\\Rodrigo\\Documents\\GitHub\\Node-Map\\src\\sockets\\test.jar', JSON.stringify(response), JSON.stringify(resjson)]);
                                process.stdout.on('data', function(data) { 
                                    console.log(data.toString()); 
                                }); 
                                process.stderr.on("data", function (data) {
                                    console.log(data.toString());
                                });
                                datos.alcaldias.forEach(alcaldia => {
                                    response.forEach(element => {
                                        let check = [element.c[0].x, element.c[0].y]
                                        if (ray.contains(alcaldia.coordinates, check)) {
                                            resjson[alcaldia.name] = resjson[alcaldia.name] + 1;
                                        }
                                    });
                                });
                                console.log(resjson);
                                socket.emit('ploting_mun', resjson);
                            }
                        });
                }
            }
        });
        socket.on('ploting_day', async (data, city, type) => {
            const model = require('../models/' + city);
            const alertas = ["POLICE", "HAZARD", "JAM", "CHIT_CHAT", "ACCIDENT", "ROAD_CLOSED"];
            if (alertas.includes(type)) {
                for (let i = 0; i < data.length; i++) {
                    let re = new RegExp(data[i][0].join("|"));
                    await model.aggregate([
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
                            let json = { "day": data[i][1] }
                            response.push(json);
                            socket.emit('ploting_day', response);
                        });
                }
            }
        });
        socket.on('ploting_oneDay', async (data, city, type) => {
            const model = require('../models/' + city);
            const alertas = ["POLICE", "HAZARD", "JAM", "CHIT_CHAT", "ACCIDENT", "ROAD_CLOSED"];
            if (alertas.includes(type)) {
                for (let i = 0; i < data.length; i++) {
                    data[i][0].forEach(element => {
                        model.aggregate([
                            { $match: { "startTime": { $regex: element }, "alerts.type": type } },
                            { $project: { "alerts": { $filter: { input: "$alerts", as: "alert", cond: { $eq: ["$$alert.type", type] } } } } },
                            { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                            { $unwind: "$alerts" },
                            { $group: { _id: { "uuid": "$alerts.uuid" }, "c": { $addToSet: "$alerts.location" }, "count": { $sum: 1 } } },
                            { $match: { count: { $gt: 0 } } },
                            { $count: "count" }
                        ]).
                            exec(function (err, response) {
                                if (err) return handleError(err);
                                    let hrjson = { "hr":  element.substr(-2) + ':00'}
                                    let dayjson = {"day": element.substr(0,10)}
                                    response.push(hrjson,dayjson);
                                    socket.emit('ploting_oneDay', response);
                            });
                    });
                }
            }
        });
    });
}