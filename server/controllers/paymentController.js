const pool = require('../config/dbconfig')
var data = require('../data')

const axios = require('axios')
const { format } = require('../config/dbconfig')

var userInfo = data.userInfo

exports.viewOrder = (req, res) => {
    //
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var orders = []

    res.render('account/orders',{userInfo:userInfo,orders, style:"account.css", title:"Akili forums orders"});

}

exports.searchOrder = (req, res) => {
    
    var {payby,status,date_from, date_to} = req.body

    var date_from = date_from+' 00:00:00'
    var date_to = date_to+' 00:00:00'

    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var query = "SELECT od.order_id, od.post_type, od.payby, od.post_id, od.created_at, od.amount, od.status, od.user_id, us.username, us.phone_number FROM orders AS od INNER JOIN users AS us ON od.user_id = us.id WHERE od.payby = ? AND od.status = ? AND od.created_at >= ? AND od.created_at < ?"

    pool.getConnection((err, connection) =>{
        if(err) throw err;

        connection.query(query,[payby, status, date_from, date_to ],(err, orders) => {
            if(!err){
                
                res.render('account/orders',{userInfo:userInfo,orders, style:"account.css", title:"akili skills app"});

            }else{

                console.log(err)
            }
        })
    })    
    

}

exports.tumaCode =(req, res) =>{

    var  {user_id,post_id,post_type,price,code_number} = req.body

    var order_id = user_id+'-'+post_id+'-'+code_number
             //connect to DB
            pool.getConnection((err, connection) =>{

                if(err) throw err;
                connection.query("INSERT INTO orders SET order_id = ?, amount = ?, user_id = ?,post_id = ?,post_type = ?, payby = ?",[order_id,price,user_id,post_id,post_type,'mpy'],(err, rows) => {
                    if(!err){
                        return res.send({status:'good',msg:"Asante Uthibitisho Unashuhulikiwa ndani ya masaa 24, nenda katika account yako utaona Kozi hii"})
                    }else{
                        return res.send({status:'bad',msg:"Samahani Jaribu tena"})
                    } 
                })
            })   
}

exports.payment = (req, res) => {
    //
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var dataz = req.session.dataz
    //console.log(dataz)
    res.render('payment',{userInfo:userInfo,dataz, style:"for_partials.css", title:"akili skills app"});

}

exports.makePayment =(req, res) =>{

    var  {user_id,post_id,post_type,price,title,phone_number} = req.body

    var order_id = user_id+'-'+post_id+'-'+Math.random().toString(36).substring(2,7)

    var datena = req.session.dataz
    if(datena){
        price = datena.price
    }
    console.log('still in session')
    console.log(datena)

    var payload = {
            api:170,
            code:104, 
            data:{
                api_key:"MDAzZTYzNjVkOWM1NDU4ZThjZGJkYTU2MTJmMDg3NDg=",
                secret:"pbkdf2_sha256$260000$7hoiL8enOqB06hYylekJVb$1lma0fbMn9+YPfXT320//+quAwM34zeMI47DKxDe4KM=",
                order_id:order_id,
                amount:price,
                username:"akilikubwa",
                is_live :true,
                phone_number:phone_number,
                cancel_url:"http://localhost:8000/cancel",
                webhook_url:"http://localhost:8000/success",
                success_url:"http://localhost:8000/success",
                metadata:{
                    secret:"pbkdf2_sha256$260000$7hoiL8enOqB06hYylekJVb$1lma0fbMn9+YPfXT320//+quAwM34zeMI47DKxDe4KM=",
                }
            }
    };

    axios({
        method: 'post',
        url: 'https://swahiliesapi.invict.site/Api',
        data: payload
      }).then(response => {
        console.log(response.data)
        if(response.data.code == 200){
            //var resData = response.data.data
            //resData = JSON.parse(resData)
            //console.log(resData)
            //var order_id = resData.order_id
             //connect to DB
            pool.getConnection((err, connection) =>{

                if(err) throw err;
                connection.query("INSERT INTO orders SET order_id = ?, amount = ?, user_id = ?,post_id = ?,post_type = ?",[order_id,price,user_id,post_id,post_type],(err, rows) => {
                    if(!err){
                        return res.send({status:'good',order_id,user_id})
                    }else{
                        return res.send({status:'good',order_id,user_id})
                    } 
                })
            })
            

            
        }else if(response.data.code == 300){
            return res.send({status:'bad',msg:"malipo hayaja fanyika, hakikisha namba jaribu tena"})
        }
        //console.log(response.data.explanation);
        
      })
      .catch(error => {
        console.log(error);
        return res.send({status:'bad',msg:"malipo hayaja fanyika, cheki internet jaribu tena"})
      });

    
}

exports.sibitishaAdmin = (req, res) =>{
    
    var  {user_id,order_id,amount,post_id,post_type,payby} = req.body
    
    //console.log(req.body)

    var time = new Date()
    var month = 2678400  //10800
    var time_sec = Math.round(time.getTime() / 1000) + month

    var payload = {
        api:170,
        code:105, 
        data:{
            api_key:"MDAzZTYzNjVkOWM1NDU4ZThjZGJkYTU2MTJmMDg3NDg=",
            order_id:order_id,
        }
    };

    var query = "INSERT INTO payed SET payby = ?, order_id = ?, amount = ?, user_id = ?,post_id = ?,post_type = ?, time_sec = ?;"
        query += "UPDATE orders SET status = ? WHERE order_id = ?;"

        
    if(payby == "swh"){
    axios({
        method: 'post',
        url: 'https://swahiliesapi.invict.site/Api',
        data: payload
      }).then(response => {
        //console.log(response)
        var dataz = response.data

        console.log(dataz)

        if(dataz.code == 200){
             var order_status = dataz.order[0].status
            
             if(order_status == 'paid'){
                pool.getConnection((err, connection) =>{
                    if(err) throw err;  
                    connection.query(query,[payby,order_id,amount,user_id,post_id,post_type,time_sec,order_status,order_id],(err, rows) =>{
                        if(!err){
                            //console.log('done kusibitishaaaaaaaaaa')
                            //res.redirect('/account');
                            return res.send({status:'good',msg:"Done mr Admin"})
                        }else{
                            console.log(err);
                        }
                    })
                })

             }else{
                return res.send({status:'bad',msg:"malipo hayaja fanyika / hakikisha malipo SWAHILIES ADMIN"})
             }
            
        }else{
            return res.send({status:'bad',msg:"jaribu tena / hakikisha malipo SWAHILIES ADMIN"})
        }

       
        
      })
      .catch(error => {
        console.log(error);
        return res.send({status:'bad',msg:"Hakikisha internet, Thimitisha tena "})
      });

    }else{

        pool.getConnection((err, connection) =>{
            if(err) throw err;  
            connection.query(query,[payby,order_id,amount,user_id,post_id,post_type,time_sec,'paid',order_id],(err, rows) =>{
                if(!err){
                    //console.log('done kusibitishaaaaaaaaaa')
                    //res.redirect('/account');
                    return res.send({status:'good',msg:"Done mr Admin"})
                }else{
                    console.log(err);
                }
            })
        })

    }

}

exports.sibitishaPayment = (req, res) =>{
    
    var  {user_id,order_id,amount,post_id,post_type} = req.body

    //var user_id = datena.user_id
    //var amount = datena.price
    //var post_id = datena.post_id
    //var post_type = datena.post_type
    
    var time = new Date()
    var month = 2678400  //10800
    var time_sec = Math.round(time.getTime() / 1000) + month

    var payload = {
        api:170,
        code:105, 
        data:{
            api_key:"MDAzZTYzNjVkOWM1NDU4ZThjZGJkYTU2MTJmMDg3NDg=",
            order_id:order_id,
        }
    };

    var query = "INSERT INTO payed SET order_id = ?, amount = ?, user_id = ?,post_id = ?,post_type = ?, time_sec = ?;"
        query += "UPDATE orders SET status = ? WHERE order_id = ?;"

    axios({
        method: 'post',
        url: 'https://swahiliesapi.invict.site/Api',
        data: payload
      }).then(response => {
        //console.log(response)
        var dataz = response.data

        console.log(dataz)

        if(dataz.code == 200){
             var order_status = dataz.order[0].status
            
             if(order_status == 'paid'){
                pool.getConnection((err, connection) =>{
                    if(err) throw err;  
                    connection.query(query,[order_id,amount,user_id,post_id,post_type,time_sec,order_status,order_id],(err, rows) =>{
                        if(!err){
                            console.log('done kusibitishaaaaaaaaaa')
                            //res.redirect('/account');
                            return res.send({status:'good'})
                        }else{
                            console.log(err);
                        }
                    })
                })

             }else{
                return res.send({status:'bad',msg:"malipo hayaja fanyika jaribu tena / wasiliana na mtoa huduma"})
             }
            
        }else{
            return res.send({status:'bad',msg:"malipo hayaja fanyika jaribu tena / wasiliana na mtoa huduma"})
        }

       
        
      })
      .catch(error => {
        console.log(error);
        return res.send({status:'bad',msg:"Hakikisha internet, Thimitisha tena "})
      });

}
exports.cancelPayment =(req, res) =>{
    
    console.log("requesties received")
    console.log(req.body)

}

exports.successPayment =(req, res) =>{
    
    console.log("requesties success")
    console.log(req.body)

}

/////////////expart payment

exports.paymentData =(req, res) =>{

    var  {method,number} = req.body

    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
     }

    var user_id = req.session.user.user.id;
             //connect to DB
            pool.getConnection((err, connection) =>{

                if(err) throw err;
                connection.query("INSERT INTO payment_accounts SET user_id = ?, method = ?, number = ?",[user_id,method,number],(err, rows) => {
                    if(!err){
                        return res.send({status:'good',msg:"Payment data added successful"})
                    }else{
                        return res.send({status:'bad',msg:"Samahani Jaribu tena"})
                    } 
                })
            })   
}

exports.paymentRequest =(req, res) =>{

    var  {amount} = req.body

    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
     }

    var user_id = req.session.user.user.id;
             //connect to DB
            pool.getConnection((err, connection) =>{

                if(err) throw err;
                connection.query("INSERT INTO payment_request SET user_id = ?, amount = ?",[user_id,amount],(err, rows) => {
                    if(!err){
                        return res.send({status:'good',msg:"Request Received successful"})
                    }else{
                        return res.send({status:'bad',msg:"Samahani Jaribu tena"})
                    } 
                })
            })   
}

exports.viewRequest = (req, res) => {
    //
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var query = "SELECT COUNT(id) FROM payment_request WHERE status = 'pending';"

    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(query,(err, rows) =>{
            if(!err){

                var pending = rows[0]['COUNT(id)']
                var requesties = []

                res.render('payments/request',{userInfo:userInfo,requesties,pending, style:"account.css", title:"Payment request page"});
            }else{
                console.log(err);
            }
        })
    })
}

exports.searchRequest = (req, res) => {
    
    var {date_from, date_to} = req.body

    var date_from = date_from+' 00:00:00'
    var date_to = date_to+' 00:00:00'

    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var query = "SELECT COUNT(id) FROM payment_request WHERE status = 'pending';"
        query += "SELECT od.id, od.amount, od.created_at, od.status, od.user_id, us.avator, us.username, us.phone_number FROM payment_request AS od INNER JOIN users AS us ON od.user_id = us.id WHERE od.status = ? AND od.created_at >= ? AND od.created_at <= ?"

    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(query,['pending', date_from, date_to],(err, rows) =>{
            if(!err){

                var pending = rows[0][0]['COUNT(id)']
                var requesties = rows[1]

                res.render('payments/request',{userInfo:userInfo,requesties,pending, style:"account.css", title:"Payment request page"});
            }else{
                console.log(err);
            }
        })
    })
    

}

exports.getPaynow = (req, res) => {
    
    var {req_id, exp_id, amount} = req.body

    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var queries = "SELECT SUM(p.amount) AS Total_p FROM audio_courses AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'audio';"
    queries += "SELECT SUM(p.amount) AS Total_p FROM video_courses AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'video';"
    queries += "SELECT SUM(p.amount) AS Total_p FROM books AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'book';"
    queries += "SELECT SUM(p.payed_amount) AS Total_p FROM payment_request AS a INNER JOIN payment_completed AS p ON a.id = p.order_id WHERE a.user_id = ? AND a.status = 'paid';"
    queries += "SELECT pa.number, pm.methode_name FROM payment_accounts AS pa INNER JOIN payments_methods AS pm ON pa.method = pm.m_id WHERE pa.user_id = ? LIMIT 1;"

    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(queries,[exp_id, exp_id, exp_id, exp_id, exp_id],(err, rows) =>{
            if(!err){

                var t_audio = rows[0][0]['Total_p']
                var t_video = rows[1][0]['Total_p']
                var t_book = rows[2][0]['Total_p']
                var t_paid = rows[3][0]['Total_p'] + 0
                var no = rows[4][0].number
                var method_name = rows[4][0].methode_name

                t_earn = (t_video + t_audio + t_book + 0)
                t_balance = (t_earn - t_paid) + 0

                t_earn = t_earn.toLocaleString()
                t_paid = t_paid.toLocaleString()
                t_balance = t_balance.toLocaleString()

                return res.send({status:'good',data:{t_earn, t_balance, t_paid, no, method_name}})
            }else{
                console.log(err);
                return res.send({status:'bad',msg:"Samahani Jaribu tena"})
            }
        })
    })
    

}

exports.expertPaynow = (req, res) => {
    
    var {req_id, exp_id, amount, ref, method} = req.body

    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var user_id = req.session.user.user.id;

    var queries = "INSERT INTO payment_completed SET order_id = ?, payed_amount = ?, paid_by = ?, method = ?, payment_ref = ?;"
        queries += "UPDATE payment_request SET status = 'paid' WHERE id = ?;"
    
    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(queries,[req_id,amount,user_id,method,ref,req_id],(err, rows) =>{
            if(!err){
                res.redirect('/account/request');
            }else{
                res.redirect('/account/request');
            }
        })
    })
    

}

exports.viewExpPayment = (req, res) => {
    //
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var user_id = req.session.user.user.id;

    var query = "SELECT SUM(p.payed_amount) AS Total_p FROM payment_request AS a INNER JOIN payment_completed AS p ON a.id = p.order_id WHERE a.user_id = ? AND a.status = 'paid';"
        query += "SELECT pc.payed_amount,pc.created_at, pc.method FROM payment_request AS pr INNER JOIN payment_completed AS pc ON pr.id = pc.order_id WHERE user_id = ? AND pr.status = 'paid';"

    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(query,[user_id, user_id],(err, rows) =>{
            if(!err){

                var t_paid = rows[0][0]['Total_p'] + 0
                var payments = rows[1]

                res.render('payments/exp_payments',{userInfo:userInfo, payments, t_paid, style:"account.css", title:"Expert Payment page"});
            }else{
                console.log(err);
            }
        })
    })
}

exports.searchExpPayment = (req, res) => {
    
    var {date_from, date_to} = req.body

    var date_from = date_from+' 00:00:00'
    var date_to = date_to+' 00:00:00'

    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var user_id = req.session.user.user.id;

    var query = "SELECT SUM(p.payed_amount) AS Total_p FROM payment_request AS a INNER JOIN payment_completed AS p ON a.id = p.order_id WHERE a.user_id = ? AND a.status = 'paid' AND p.created_at >= ? AND p.created_at < ?;"
        query += "SELECT pc.payed_amount,pc.created_at, pc.method FROM payment_request AS pr INNER JOIN payment_completed AS pc ON pr.id = pc.order_id WHERE user_id = ? AND pr.status = 'paid' AND pc.created_at >= ? AND pc.created_at < ?;"

    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(query,[user_id, date_from, date_to,user_id, date_from, date_to],(err, rows) =>{
            if(!err){

                var t_paid = rows[0][0]['Total_p'] + 0
                var payments = rows[1]

                res.render('payments/exp_payments',{userInfo:userInfo, payments, t_paid, style:"account.css", title:"Expert Payment page"});
            }else{
                console.log(err);
            }
        })
    })
}

exports.viewPayment = (req, res) => {
    //
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var user_id = req.session.user.user.id;

    var query = "SELECT SUM(p.payed_amount) AS Total_p FROM payment_request AS a INNER JOIN payment_completed AS p ON a.id = p.order_id WHERE a.status = 'paid';"
        

    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(query,(err, rows) =>{
            if(!err){

                var t_paid = rows[0]['Total_p'] + 0
                var payments = []

                res.render('payments/payments',{userInfo:userInfo, payments, t_paid, style:"account.css", title:"Expert Payment page"});
            }else{
                console.log(err);
            }
        })
    })
}

exports.searchPayment = (req, res) => {
    
    var {date_from, date_to} = req.body

    var date_from = date_from+' 00:00:00'
    var date_to = date_to+' 00:00:00'

    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    var user_id = req.session.user.user.id;

    var query = "SELECT SUM(p.payed_amount) AS Total_p FROM payment_request AS a INNER JOIN payment_completed AS p ON a.id = p.order_id WHERE a.status = 'paid' AND p.created_at >= ? AND p.created_at < ?;"
        query += "SELECT pc.payed_amount,pc.created_at,us.username,pa.number, pc.method FROM payment_request AS pr INNER JOIN payment_completed AS pc ON pr.id = pc.order_id INNER JOIN users AS us ON pr.user_id = us.id INNER JOIN payment_accounts AS pa ON pr.user_id = pa.user_id WHERE pr.status = 'paid' AND pc.created_at >= ? AND pc.created_at < ?;"

    pool.getConnection((err, connection) =>{
        if(err) throw err;  
        connection.query(query,[date_from, date_to,date_from, date_to],(err, rows) =>{
            if(!err){

                var t_paid = rows[0][0]['Total_p'] + 0
                var payments = rows[1]

                res.render('payments/payments',{userInfo:userInfo, payments, t_paid, style:"account.css", title:"Expert Payment page"});
            }else{
                console.log(err);
            }
        })
    })
}

