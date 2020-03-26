const express = require('express');
const router = express.Router();
var oldChats;

const {
    ensureAuthenticated
} = require('../config/auth');

//Models
const Chat = require('../models/Chat');
const Mindmap = require('../models/Mindmap');

//welcome page
router.get('/', (req, res) => {
    res.render('welcome');
});

//GET mindmap private
//Rendering mindmap page and then create mindmap 

router.get('/mindmap', ensureAuthenticated, (req, res) => {

    res.render('mindmap');
});

//POST mindmap public
//Posting mindmap which you created to db and then rndering welcome page
//P.S: I saved html part of code as html with escaping, I know it is shitty code :) 

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
    if (errors.length > 0) {
        errors.push({
            msg: 'Something went wrong'
        });
        res.render('mindmap');
    }

    html = escape(html);
    const newMindmap = new Mindmap({
        map_name: map_name,
        html: html,
        user: req.session.passport.user
    });

    await newMindmap.save().then(mindmap => {
            req.flash('succes_msg', 'You saved your mindmap succesfully');
            res.redirect('/');
        })
        .catch(err => console.log(err));
})


//GET your mind maps in this page private
//Get mind maps in your account and can go to the specific saved mindmap to continue your work

router.get('/mindmap/open', ensureAuthenticated, async (req, res) => {
    let mindmaps = [];
    await Mindmap.find({
        user: req.session.passport.user
    }, function (err, result) {
        if (err) throw err;
        mindmaps = result;
    }).select('-html');

    res.render('mindmapopen', {
        mindmaps: mindmaps
    });
})

//GET  mindmap with id private
//Get mind map with id to editing your saved content after that you can save it 

router.get('/mindmap/:id', ensureAuthenticated, async (req, res) => {
    const mindmapwithID = await Mindmap.findById(req.params.id);

    res.render('mindmapid', {
        mindmapwithID: mindmapwithID,

    });
});


//UPDATE old mindmap with newone ensureAuthenticated
//Update your old mindmap with new one
//P.S. I can't use PUT method but I used POST method instead, everything looks cool so ..

router.post('/mindmap/:id', ensureAuthenticated, async (req, res) => {
    let {
        html
    } = req.body;
    let errors = [];
    html = escape(html);
    if (errors.length > 0) {
        errors.push({
            msg: "Something went wrong."
        });
    }
    let modifiedmindmap = await Mindmap.findById(req.params.id);
    modifiedmindmap.html = html;
    await modifiedmindmap.save().then(mindmap => {
            req.flash('succes_msg', 'You saved your mindmap succesfully');
            res.redirect('/');
        })
        .catch(err => console.log(err));
});


//GETS Chat Page
//It renders chat page and it retrieves also oldchats from db

router.get('/chat', ensureAuthenticated, async (req, res) => {

    await Chat.find((err, chat) => {
        if (err) throw err;
        else {
            oldChats = chat;
        }
    });
    res.render('chat', {
        name: req.user.name,
        oldChats: oldChats
    });
})

module.exports = router;