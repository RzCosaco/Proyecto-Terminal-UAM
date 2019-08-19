module.exports = io => {
    io.on('connection', socket => {
        socket.on('ploting_mun', async (data, city, type) => {
            const model = require('../models/' + city);
            const datos = require('../resources/json/alcaldias.json');
            const ray = require('../resources/functions/rayCasting.js');
            const alertas = ["POLICE", "HAZARD", "JAM", "CHIT_CHAT", "ACCIDENT", "ROAD_CLOSED"];
            if (alertas.includes(type)) {
                for (let i = 0; i < data.length; i++) {
                    let re = new RegExp(data[i][0].join("|"));
                    await model.aggregate([
                        { $match: { "tiempo": { $regex: re }, "alerts.type": type } },
                        { $project: { "alerts": { $filter: { input: "$alerts", as: "alert", cond: { $eq: ["$$alert.type", type] } } } } },
                        { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                        { $unwind: "$alerts" },
                        { $group: { _id: { "uuid": "$alerts.uuid" }, "c": { $addToSet: "$alerts.location" } } },
                        { $project: { _id: 0, "c": 1 } }
                    ]).
                        exec(function (err, response) {
                            if (err) return handleError(err);
                            if (response.length > 0) {
                                let resjson = {
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
                                        let check = [element.c[0].x, element.c[0].y]
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
        });
        socket.on('ploting_day', async (data, city, type) => {
            const model = require('../models/' + city);
            const alertas = ["POLICE", "HAZARD", "JAM", "CHIT_CHAT", "ACCIDENT", "ROAD_CLOSED"];
            if (alertas.includes(type)) {
                for (let i = 0; i < data.length; i++) {
                    let re = new RegExp(data[i][0].join("|"));
                    await model.aggregate([
                        { $match: { "tiempo": { $regex: re }, "alerts.type": type } },
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
            if (type === 'speed') {
                for (let i = 0; i < data.length; i++) {
                    let re = new RegExp(data[i][0].join("|"));
                    await model.aggregate([
                        { $match: { "tiempo": { $regex: re } } },
                        { $project: { "jams.id": 1, "jams.speedKMH": 1, _id: 0 } },
                        { $unwind: "$jams" },
                        { $group: { _id: { "ids": "$jams.id" }, "vel": { $avg: "$jams.speedKMH" } } },
                        { $group: { _id: null, "count": { $avg: "$vel" } } },
                        { $project: { count: 1, _id: 0 } }
                    ]).
                        exec(function (err, response) {
                            if (err) return handleError(err);
                            let json = { "day": data[i][1] }
                            response.push(json);
                            socket.emit('ploting_day', response);
                        });
                }
            }
            if(type === 'report'){
                for (let i = 0; i < data.length; i++) {
                    let re = new RegExp(data[i][0].join("|"));
                    await model.aggregate([
                        { $match: { "tiempo": { $regex: re } } },
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
                            { $match: { "tiempo": { $regex: element }, "alerts.type": type } },
                            { $project: { "alerts": { $filter: { input: "$alerts", as: "alert", cond: { $eq: ["$$alert.type", type] } } } } },
                            { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                            { $unwind: "$alerts" },
                            { $group: { _id: { "uuid": "$alerts.uuid" }, "c": { $addToSet: "$alerts.location" }, "count": { $sum: 1 } } },
                            { $match: { count: { $gt: 0 } } },
                            { $count: "count" }
                        ]).
                            exec(function (err, response) {
                                if (err) return handleError(err);
                                let hrjson = { "hr": element.substr(-2) + ':00' }
                                let dayjson = { "day": element.substr(0, 10) }
                                response.push(hrjson, dayjson);
                                socket.emit('ploting_oneDay', response);
                            });
                    });
                }
            }
            if (type === 'speed') {
                for (let i = 0; i < data.length; i++) {
                    data[i][0].forEach(element => {
                        model.aggregate([
                            { $match: { "tiempo": { $regex: element } } },
                            { $project: { "jams.id": 1, "jams.speedKMH": 1, _id: 0 } },
                            { $unwind: "$jams" },
                            { $group: { _id: { "ids": "$jams.id" }, "vel": { $avg: "$jams.speedKMH" } } },
                            { $group: { _id: null, "count": { $avg: "$vel" } } },
                            { $project: { count: 1, _id: 0 } }
                        ]).
                            exec(function (err, response) {
                                if (err) return handleError(err);
                                let hrjson = { "hr": element.substr(-2) + ':00' }
                                let dayjson = { "day": element.substr(0, 10) }
                                response.push(hrjson, dayjson);
                                socket.emit('ploting_oneDay', response);
                            });
                    });
                }
            }
            if (type === 'report'){
                for (let i = 0; i < data.length; i++) {
                    data[i][0].forEach(element => {
                        model.aggregate([
                            { $match: { "tiempo": { $regex: element } } },
                            { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                            { $unwind: "$alerts" },
                            { $group: { _id: { "uuid": "$alerts.uuid" }, "c": { $addToSet: "$alerts.location" }, "count": { $sum: 1 } } },
                            { $match: { count: { $gt: 0 } } },
                            { $count: "count" }
                        ]).
                            exec(function (err, response) {
                                if (err) return handleError(err);
                                let hrjson = { "hr": element.substr(-2) + ':00' }
                                let dayjson = { "day": element.substr(0, 10) }
                                response.push(hrjson, dayjson);
                                socket.emit('ploting_oneDay', response);
                            });
                    });
                }
            }
        });
    });
}
