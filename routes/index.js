const express = require('express');
const router = express.Router();
var oldChats;

const {
    ensureAuthenticated
} = require('../config/auth');

const Chat =require('../models/Chat');

//welcome page
router.get('/', (req, res) => {
    res.render('welcome');
});

router.get('/mindmap', ensureAuthenticated ,(req,res)=>{
    res.render('mindmap');
})

//chat page
router.get('/chat', ensureAuthenticated, async (req, res) => {
    
await Chat.find((err,chat)=>{
    oldChats=chat;   
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