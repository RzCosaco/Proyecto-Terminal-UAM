module.exports = io => {
    io.on('connection', socket => {
        //console.log('new user connected');
        socket.on('ploting', async (data,city,type) => {
            const model = require('../models/' + city);
            var alertas = ["POLICE","HAZARD","JAM","CHIT-CHAT","ACCIDENT","ROAD_CLOSED"];
            console.log(type);
            if(alertas.includes(type)){
            for (let i = 0; i < data.length; i++) {
                var re = new RegExp(data[i][0].join("|"));
                model.aggregate([
                    { $match: { "startTime": { $regex: re }, "alerts.type": type } },
                    { $project: { "alerts": { $filter: { input: "$alerts", as: "alert", cond: { $eq: ["$$alert.type", type] } } } } },
                    { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                    { $unwind: "$alerts" },
                    { $group: { _id: { "uuid": "$alerts.uuid" }, "unique": { $addToSet: "$alerts.location" }, "count": { "$sum": 1 } } },
                    { $match: { count: { $gt: 0 } } },
                    { $count: "count" }
                ]).
                    exec(function (err, response) {
                        if (err) return handleError(err);
                        console.log(response);
                        io.to(socket.id).emit('ploting', response);
                    });
            }
        }
        });
    });
}