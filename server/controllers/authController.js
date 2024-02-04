const pool = require('../config/dbconfig')
const bcrypt = require('bcrypt');
var data = require('../data')

var richFunctions = require('../richardFunctions')

const axios = require("axios");
const https = require("https");
var btoa = require("btoa");

const api_key = "958144a52338709f";
const secret_key = "ZDc1Nzk5NDg5NjQ3NDkwZmRmYzQzMzZiZTg1YjBlMDE1NjI1YTFhMTEzMTA1ZWQ1YTIzNDU0ODRlOTI2NDY2Nw==";
const content_type = "application/json";
const source_addr ="NEWFORUM";

var farFuture = new Date(new Date().getTime() + (1000*60*60*24*365*10));

var userInfo = data.userInfo;

////constroller functions
//4 get pass
exports.forgetPassword = (req, res) =>{

    var { username, phone_number } = req.body;

    var phone1 = phone_number.substr(phone_number.length - 9);
    
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        ///check if user exist
        connection.query('SELECT * FROM users WHERE username = ?',[username], (err, rows) => { 
            if(!err){

                if(rows.length == 0){
                    return res.send('fail_username') 
                }

                var phone2 = rows[0].phone_number 
                
                console.log("phone numba1 "+phone1)

                var phone2 = phone2.substr(phone2.length - 9);
                console.log("phone numba2 "+phone2)

                if(phone1 == phone2){
                    
                    var password = richFunctions.randomString(8,'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    bcrypt.hash(password, 10, function(err, hash) {

                        connection.query("UPDATE users SET password = ? WHERE username = ?",[hash, username],(err,rows)=>{
                            if(!err){
                                axios
                                .post(
                                "https://apisms.beem.africa/v1/send",
                                {
                                    source_addr: source_addr,
                                    schedule_time: "",
                                    encoding: 0,
                                    message: "Kwasasa nenosiri ni "+password+" lakini nivema ukabadiri ulipendalo, go to your to change it",
                                    recipients: [
                                    {
                                        recipient_id: 1,
                                        dest_addr: "255"+phone1,
                                    }
                                    ]
                                },
                                {
                                    headers: {
                                    "Content-Type": content_type,
                                    Authorization: "Basic " + btoa(api_key + ":" + secret_key),
                                    },
                                    httpsAgent: new https.Agent({
                                    rejectUnauthorized: false,
                                    }),
                                }
                                )
                                .then(
                                    (response) => {console.log(response, api_key + ":" + secret_key)
                                    return res.send('success')
                                })
                                .catch((error) => {console.error(error.response.data)
                                    return res.send('fail_send')
                                });
                            }else{
                                console.log(err);
                            }
                         })

                    }) 
       
                }
                else{
                    return res.send('fail_phone')
                }

                ////send
                
            }else{
                console.log(err);
                return res.send('fail')
            }
        })
    })   

}



exports.loginForm = (req, res)=>{
    //console.log(req.session.user)
    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
     }
 
    const locals = {
        title:"Login",
        description:"get Join to New forums"
    }

    if(req.session.flag == 1){
        req.session.destroy();
        res.render('auth/login',{userInfo,locals,message:"Password miss match"})
    }else if(req.session.flag == 2){
        req.session.destroy();
        res.render('auth/login',{userInfo,locals,message:"Incorrect Username"})
    }else if(req.session.flag == 3){
        req.session.destroy();
        res.render('auth/login',{userInfo,locals,message:"Server error try again"})
    }else{
        res.render('auth/login',{userInfo,locals,message:""})
    }
    
}

exports.registerForm = (req, res)=>{
    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
     }
 
    const locals = {
        title:"Register ",
        description:"get Registered to New forums"
    }
    if(req.session.flag == 1){
        req.session.destroy();
        res.render('auth/register',{locals,userInfo,message:"Username already exist"})
    }else if(req.session.flag == 2){
        req.session.destroy();
        res.render('auth/register',{locals,userInfo,message:"Server error try again"})
    }else{
        res.render('auth/register',{locals,userInfo,message:""})
    }
    
}

//register
exports.register = (req, res) => {
    var { username, password, phone_number,path} = req.body;

    if(path){
        req.session.path = path
    }
   
    //password cryption
    //const salt = bcrypt.genSaltSync();
	//password = bcrypt.hashSync(password, salt);
    //var hashPassword = bcrypt.hashSync(password, 10);
    //connect to DB
    
   
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        ///check if user exist
        connection.query('SELECT * FROM users WHERE username = ?',[username], (err, rows) => { 
            if(!err){
                if(rows.length == 0){
                    //inser query
                    bcrypt.hash(password, 10, function(err, hash) {
                        connection.query('INSERT INTO users SET username = ? , password = ? , phone_number = ?',[username, hash, phone_number], (err, rows) => {
                            if(!err){
                                var id = rows.insertId
                                connection.query('SELECT * FROM users WHERE id = ?',[id], (err, rows) => { 
                                    if(!err){
                                        //console.log(rows)
                                        var role = rows[0].role
                                        var subscription = rows[0].subscription
                                        var avator = rows[0].avator
                                        var id = rows[0].id
                                        var phone_number = rows[0].phone_number
                                        var logedUser = {isLoged:true, user:{username,role,subscription,avator,id,phone_number}}
    
                                        req.session.user = logedUser;
                                        res.cookie('new_forum_user',logedUser,{ expires: farFuture })

                                        console.log('from login')
                                        console.log(req.session.user);
                                        if(req.session.path){
                                            res.redirect(req.session.path);
                                        }else{
                                            res.redirect('/');
                                        }
                                        
                                    }else{
                                        res.redirect('/login');  
                                    }
                                    //req.session.user = logedUser;
                                    //res.redirect('/register'); 
                                })        
                            }else{
                                req.session.flag = 2
                                console.log(err);
                                res.redirect('/register');
                                
                            }
                        })
                      });
                    
                   
                }else{
                    req.session.flag = 1    
                    console.log('user exist');
                    res.redirect('/register');
                }
            }else{
                req.session.flag = 2
                console.log('server error');
                res.redirect('/register');
            }
        })
       
    })

}

exports.login = (req, res) => {
    var { username, password, path} = req.body;

    if(path){
        req.session.path = path
        console.log('path session seted - login')
        console.log(req.session.path)
    }else{
        console.log('no new path session seted - login')
        console.log(req.session.path)
    }
    
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users WHERE username = ?',[username], (err, rows) => { 
            if(!err){
                if(rows.length != 0){
                    var pass = rows[0].password
                    console.log(pass+", "+password)
                   
                    /*hashedPassword = bcrypt.compareSync(password, pass)
                    console.log("passs this "+hashedPassword)
                    bcrypt.compare(password, pass, function(err, result) {
                        console.log("wow totale newwwww")
                        console.log(result)
                    });

                    bcrypt.compare(password, pass).then(function(result) {
                        console.log("wow totale newwwww plomise")
                        console.log(result)
                    });

                    bcrypt.compare(password, pass, function(err, res) {
                       
                        console.log("wow wow new one")
                        console.log(res)
                    });*/
                    
                    var doMatch = bcrypt.compareSync(password, pass)

                        if(doMatch){
                            var role = rows[0].role
                            var subscription = rows[0].subscription
                            var avator = rows[0].avator
                            var id = rows[0].id
                            var phone_number = rows[0].phone_number
                            var logedUser = {isLoged:true, user:{username,role,subscription,avator,id,phone_number}}

                            req.session.user = logedUser;
                            res.cookie('new_forum_user',logedUser,{ expires: farFuture })
                            //after login
                            console.log('after login')
                            console.log(req.session.user)
                            if(req.session.path){
                                res.redirect(req.session.path);
                            }else{
                                res.redirect('/account');
                            }
                        }else{
                            req.session.flag = 1
                            console.log('password miss match')
                            res.redirect('/login');
                        }

                }else{
                    req.session.flag = 2
                    console.log('user not exist')
                    res.redirect('/login');
                }

            }else{
                req.session.flag = 3
                res.redirect('/login');
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.logout = (req, res) => {
    if (req.session.user) {
		req.session.user = {isLoged:false,user:{}};
        console.log("ater log outttttttt")
        console.log(req.session.user)
        res.clearCookie('new_forum_user')
        
        res.redirect('/');
    } else {
        res.redirect('/');
    }
}

exports.changePassword = (req, res) => {

    var { username, cpassword, npassword} = req.body; 

    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query('SELECT * FROM users WHERE username = ?',[username], (err, rows) => { 
            if(!err){
                if(rows.length != 0){
                    var pass = rows[0].password

                    var doMatch = bcrypt.compareSync(cpassword, pass)

                        if(doMatch){
                            bcrypt.hash(npassword, 10, function(err, hash) {

                            connection.query("UPDATE users SET password = ? WHERE username = ?",[hash, username],(err,rows)=>{
                                if(!err){
                                    return res.send('success')
                                }else{
                                    return res.send('fail_db')
                                }
                            }) 

                            })   
                                
                        }else{
                            return res.send('fail_password')
                        }
                }else{
                    return res.send('fail_username')
                }
            }else{
                console.log(err)
                return res.send('fail_db')
            }
        }) 
    })


}
  


