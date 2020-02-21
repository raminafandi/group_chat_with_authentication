const express = require('express');
const router = express.Router();
var oldChats;

const {
    ensureAuthenticated
} = require('../config/auth');

const Chat = require('../models/Chat');
const Mindmap = require('../models/Mindmap');

//welcome page
router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/mindmap', ensureAuthenticated,  (req, res) => {

    res.render('mindmap');
});


router.post('/mindmap', ensureAuthenticated, async (req, res) => {
    let {
        map_name,
        html
    } = req.body;

    let errors = [];
    if (!map_name || !html) {
        errors.push({
            msg: 'Please enter all fields'
        });
    }
 
    console.log(html);
    html = escape(html);
    const newMindmap = new Mindmap({
        map_name: map_name,
        html: html,
        user: req.session.passport.user
    });

    // console.log(newMindmap);
    await newMindmap.save();
    res.render('welcome');

})

router.get('/mindmap/open', ensureAuthenticated, async (req, res) => {
    let mindmaps = [];
    await Mindmap.find({
        user: req.session.passport.user
    }, function (err, result) {
        mindmaps = result;
    }).select('-html');

    res.render('mindmapopen', {
        mindmaps: mindmaps
    }); 
})

router.get('/mindmap/:id', ensureAuthenticated, async (req, res) => {
    const mindmapwithID = await Mindmap.findById(req.params.id);

    res.render('mindmapid', {
        mindmapwithID: mindmapwithID,

    });
});

//chat page
router.get('/chat', ensureAuthenticated, async (req, res) => {

    await Chat.find((err, chat) => {
        oldChats = chat;
    });
    res.render('chat', {
        name: req.user.name,
        oldChats: oldChats
    });
})


//dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
})
module.exports = router;