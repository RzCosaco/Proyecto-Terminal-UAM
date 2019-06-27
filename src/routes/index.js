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
    if (jcity.city === 'cdmx') {
        res.render('plot_cdmx', {
            jcity
        });
    } else {
        res.render('plot_all', {
            jcity
        })
    }
});

router.get('/searchMaps/:city', async (req, res) => {
    const { city } = req.params;
    const jcity = { 'city': city };
    res.render('map', {
        jcity
    });
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
