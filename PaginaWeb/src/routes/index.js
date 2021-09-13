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
    const tdate = await model.find({ 'tiempo': { $regex: date } }, { 'tiempo': 1, _id: 1 });
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

module.exports = router;
