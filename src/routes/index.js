const express = require('express');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/busqueda/:city', async (req, res) => {
    const { city } = req.params;
    const jcity = { 'city': city };
    res.render('searchType', {
        jcity
    });
});

router.get('/searchRepVel/:city', async (req, res) => {
    const { city } = req.params;
    const jcity = { 'city': city };
    res.render('plot', {
        jcity
    });
});

router.get('/searchMaps/:city', async (req, res) => {
    const { city } = req.params;
    const jcity = { 'city': city };
    res.render('map', {
        jcity
    });
});

router.get('/repVel/:city', async (req, res) => {
    const { city } = req.params;
    const jcity = { 'city': city };
    const model = require('../models/' + city);
    const days = [];
    for (var i = 0; i < 7; i++) {
        const string = Object.values(req.query)[i];
        if (string !== '') {
            days.push(parseInt(string));
        }
    }
    if (req.query.edate !== req.query.sdate) {
        const start = moment(req.query.sdate);
        const end = moment(req.query.edate);
        const darray = [];
        start.subtract(1, 'days');
        end.add(1, 'days');
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
        if (req.query.stime === '00:00' && req.query.etime === '23:00') {
            parray = darray;
        }
        else {
            var rhours = moment.range(req.query.sdate + "T" + req.query.stime + ':00', req.query.sdate + "T" + req.query.etime + ':00');
            var arhours = Array.from(rhours.by('hour'));
            const harray = arhours.map(m => m.format('HH'));
            for (let i = 0; i < darray.length; i++) {
                for (let j = 0; j < harray.length; j++) {
                    parray.push([darray[i][0].concat(' ' + harray[j]), darray[i][1]]);
                }
            }
        }
        const result = [];
        if (req.query.g1t === 'speed') {
            var check = [];
            var flag = parray[0][0].substr(0, 10);
            for (var i = 0; i < parray.length; i++) {
                if (flag !== parray[i][0].substr(0, 10)) {
                    check = [];
                    flag = parray[i][0].substr(0, 10);
                }
                console.log('Entro al Query');
                var auxj = await model.find({ 'startTime': { $regex: parray[i][0] } }, { "jams.uuid": 1, "jams.speedKMH": 1, _id: 0 }).lean();
                console.log('Salgo del Query');
                if (auxj.length > 0) {
                    for (var j = 0; j < auxj.length; j++) {
                        var uuid = [];
                        var jam = JSON.parse(JSON.stringify(auxj[j]));
                        for (let k = 0; k < jam.jams.length; k++) {
                            const element = jam.jams[k].uuid;
                            if (!check.includes(element)) {
                                check.push(element);
                                uuid.push(jam.jams[k].speedKMH);
                            }
                        }
                        var json = {
                            'day': parray[i][1],
                            'date': [parray[i][0]],
                            'data': uuid
                        };
                        result.push(json);
                    }
                }
            }
            console.log('Combino');
            var arrwaze = combine(result);
            console.log('Envio');
            res.render('plot', {
                arrwaze,
                jcity
            });
        }
        if (req.query.g1t === 'report') {
            var check = [];
            var flag = parray[0][0].substr(0, 10);
            for (var i = 0; i < parray.length; i++) {
                if (flag !== parray[i][0].substr(0, 10)) {
                    check = [];
                    flag = parray[i][0].substr(0, 10);
                }
                console.log('Entro al Query');
                var auxj = await model.find({ 'startTime': { $regex: parray[i][0] } }, { "jams.uuid": 1, _id: 0 }).lean();
                console.log('Salgo del Query');
                if (auxj.length > 0) {
                    for (var j = 0; j < auxj.length; j++) {
                        var uuid = [];
                        var jam = JSON.parse(JSON.stringify(auxj[j]));
                        for (let k = 0; k < jam.jams.length; k++) {
                            const element = jam.jams[k].uuid;
                            if (!check.includes(element)) {
                                check.push(element);
                                uuid.push(element);
                            }
                        }
                        var json = {
                            'day': parray[i][1],
                            'date': [parray[i][0]],
                            'data': [uuid.length]
                        };
                        result.push(json);
                    }
                }
            }
            console.log('Combino');
            var repwaze = combine(result);
            console.log(repwaze);
            console.log('Envio');
            res.render('plot', {
                repwaze,
                jcity
            });
        } if (req.query.g1t === 'alertasMun') {
            var check = [];
            var flag = parray[0][0].substr(0, 10);
            for (var i = 0; i < parray.length; i++) {
                if (flag !== parray[i][0].substr(0, 10)) {
                    check = [];
                    flag = parray[i][0].substr(0, 10);
                }
                console.log('Entro al Query');
                var rs = Readable();
                model.aggregate([
                    { $match: { "startTime": { $regex: parray[i][0] }, "alerts.type": "POLICE" } },
                    { $project: { "alerts": { $filter: { input: "$alerts", as: "alert", cond: { $eq: ["$$alert.type", "POLICE"] } } } } },
                    { $project: { "alerts.uuid": 1, "alerts.location": 1, _id: 0 } },
                    { $unwind: "$alerts" },
                    { $group: { _id: { "uuid": "$alerts.uuid" }, "unique": { $addToSet: "$alerts.location" }, "count": { "$sum": 1 } } },
                    { $match: { count: { $gt: 0 } } },
                    { $count: "count" }
                ]).
                    exec(function (err, response) {
                        if (err) return handleError(err);
                        console.log(response);
                    });
                //var auxj = await model.find({ 'startTime': { $regex: parray[i][0] } }, {'alerts.uuid':1,'alerts.type':1,'alerts.location':1}).lean();
                console.log('Salgo del Query');
                /*if (auxj.length > 0) {
                    for (var j = 0; j < auxj.length; j++) {
                        var uuid = [];
                        var alert = JSON.parse(JSON.stringify(auxj[j]));
                        console.log(alert.alerts.length);
                        for (let k = 0; k < alert.alerts.length; k++) {
                            const element = alert.alerts[k].uuid;
                            if (!check.includes(element) && alert.alerts[k].type === 'JAM') {
                                check.push(element);
                                uuid.push(alert.alerts[k].location);
                            }
                        }
                        var json = {
                            'day': parray[i][1],
                            'date': [parray[i][0]],
                            'data': [uuid]
                        };
                        result.push(json);
                    }
                }*/
            }

            /*console.log('Combino');
            var repwaze = combine(result);
            console.log(repwaze);
            res.send('Recibido');*/
            res.send('Recibido');
        }
    } else {
        const shr = req.query.stime;
        const ehr = req.query.etime;
        const start = moment(req.query.sdate + "T" + shr);
        const end = moment(req.query.edate + "T" + ehr);
        const range = moment.range(moment(start), moment(end));
        const range_arr = Array.from(range.by('hour'));
        const darray = range_arr.map(m => m.format('YYYY-MM-DD HH'));
        const result = [];
        if (req.query.g1t === 'speed') {
            var check = [];
            var flag = darray[0];
            for (var i = 0; i < darray.length; i++) {
                if (flag !== darray[i]) {
                    check = [];
                    flag = darray[i];
                }
                const auxj = await model.find({ 'startTime': { $regex: darray[i] } }, { "jams.uuid": 1, "jams.speedKMH": 1, _id: 0 });
                if (auxj.length > 0) {
                    for (var j = 0; j < auxj.length; j++) {
                        var uuid = [];
                        var jam = JSON.parse(JSON.stringify(auxj[j]));
                        for (let k = 0; k < jam.jams.length; k++) {
                            const element = jam.jams[k].uuid;
                            if (!check.includes(element)) {
                                check.push(element);
                                uuid.push(jam.jams[k].speedKMH);
                            }
                        }
                        var json = {
                            'day': darray[i].substr(-2) + ':00',
                            'date': [darray[i]],
                            'data': uuid
                        };
                        result.push(json);
                    }
                }
            }
            var arrwaze = combine(result);
            res.render('plot', {
                arrwaze,
                jcity
            });
        }
        if (req.query.g1t === 'report') {
            var check = [];
            var flag = darray[0];
            for (var i = 0; i < darray.length; i++) {
                if (flag !== darray[i]) {
                    check = [];
                    flag = darray[i];
                }
                var auxj = await model.find({ 'startTime': { $regex: darray[i] } }, { "jams.uuid": 1, _id: 0 })
                if (auxj.length > 0) {
                    for (var j = 0; j < auxj.length; j++) {
                        var uuid = [];
                        var jam = JSON.parse(JSON.stringify(auxj[j]));
                        for (let k = 0; k < jam.jams.length; k++) {
                            const element = jam.jams[k].uuid;
                            if (!check.includes(element)) {
                                check.push(element);
                                uuid.push(element);
                            }
                        }
                        var json = {
                            'day': darray[i].substr(-2) + ':00',
                            'date': [darray[i]],
                            'data': [uuid.length]
                        };
                        result.push(json);
                    }
                }
            }
            var repwaze = combine(result);
            res.render('plot', {
                repwaze,
                jcity
            });
        }
    }
});

router.get('/searchDate/:city', async (req, res) => {
    const { city } = req.params;
    const jcity = { 'city': city };
    const obj = req.query;
    const date = obj[Object.keys(obj)[0]];
    const model = require('../models/' + city);
    const tdate = await model.find({ 'startTime': { $regex: date } }, { 'startTime': 1, _id: 1 });
    //const tdate = await model.find({ 'startTime': { $regex: date } }, { 'alerts.uuid':1,'startTime':1,'jams.uuid': 1, _id: 1 });
    res.render('map', {
        tdate,
        jcity
    });
});

router.get('/clustered/:city&:id', async (req, res) => {
    const { id } = req.params;
    const { city } = req.params;
    const jcity = { 'city': city };
    const model = require('../models/' + city);
    const arrwaze = await model.findById(id);
    res.render('clusteredMap', {
        arrwaze,
        jcity
    });
})

router.get('/masked/:city&:id', async (req, res) => {
    const { id } = req.params;
    const { city } = req.params;
    const jcity = { 'city': city };
    const model = require('../models/' + city);
    const arrwaze = await model.findById(id);
    res.render('maskedMap', {
        arrwaze,
        jcity
    });
})

function combine(arr) {
    var combined = arr.reduce(function (result, item) {
        var current = result[item.day];
        result[item.day] = !current ? item : {
            day: item.day,
            date: current.date.concat(item.date),
            data: current.data.concat(item.data)
        };
        return result;
    }, {});
    return Object.keys(combined).map(function (key) {
        return combined[key];
    });
}

function combineA(arr) {
    var combined = arr.reduce(function (result, item) {
        var current = result[item.day];
        var aux = [];
        result[item.day] = !current ? item : {
            day: item.day,
            date: current.date.concat(item.date),
            data: current.data + item.data
        };
        return result;
    }, {});
    return Object.keys(combined).map(function (key) {
        return combined[key];
    });
}
module.exports = router;
