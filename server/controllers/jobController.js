const pool = require('../config/dbconfig')
var data = require('../data')

const axios = require('axios')

var userInfo = data.userInfo

//jobs page
exports.job = (req, res) => {
         
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    const locals = {
        title:"Jobs Page",
        description:"This is jobs lists"
    }

    res.render('jobs/jobs',{userInfo:userInfo,locals});
} 

//single page
exports.single = (req, res) => {
         
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    const locals = {
        title:"Jobs Page",
        description:"This is jobs lists"
    }

    res.render('jobs/single',{userInfo:userInfo,locals});
} 

//single page
exports.candidates = (req, res) => {
         
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    const locals = {
        title:"Jobs Page",
        description:"This is jobs lists"
    }

    res.render('jobs/candidates',{userInfo:userInfo,locals});
} 
exports.companies = (req, res) => {
         
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    const locals = {
        title:"Jobs Page",
        description:"This is jobs lists"
    }

    res.render('jobs/companies',{userInfo:userInfo,locals});
} 