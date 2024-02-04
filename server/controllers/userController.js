const pool = require('../config/dbconfig')
var data = require('../data')
var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo
///user pages functions
exports.getUserPage = (req, res) => {

  var this_user = req.body.this_user;

  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
  //query
    var query = "SELECT COUNT(id) FROM users WHERE role = ?;"
        query += "SELECT COUNT(id) FROM users WHERE role = ?;"
        query += "SELECT COUNT(id) FROM users WHERE role = ?;"
        query += "SELECT us.username,us.id, us.phone_number, us.avator, us.status, us.created_at, ro.role, ro.role_id FROM users AS us INNER JOIN user_role AS ro ON us.role = ro.role_id WHERE us.username LIKE ?  OR us.phone_number LIKE ?;"
        query += "SELECT role_id, role FROM user_role"

    connection.query(query,[0,2,2,'%'+this_user+'%','%'+this_user+'%'], (err, results) => {
      if (!err) {

       var users_no = results[0][0]['COUNT(id)']
       var expert_no = results[1][0]['COUNT(id)']
       var last_no = results[2][0]['COUNT(id)']
       var users = results[3]
       var roles = results[4]

       res.render('user/users', {userInfo: userInfo,users_no, expert_no,last_no,users,roles, style1:"for_partials.css",style:"account.css", title:"Users page" });
      }else{
        console.log(err)
      }  
    }) 
  })
}


exports.userPage = (req, res) => {

  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    //query
    var query = "SELECT COUNT(id) FROM users WHERE role = ?;"
        query += "SELECT COUNT(id) FROM users WHERE role = ?;"
        query += "SELECT COUNT(id) FROM users WHERE role = ?;"

    connection.query(query,[0,2,2], (err, results) => {
      if (!err) {

       var users_no = results[0][0]['COUNT(id)']
       var expert_no = results[1][0]['COUNT(id)']
       var last_no = results[2][0]['COUNT(id)']

       res.render('user/users', {userInfo: userInfo,users_no, expert_no,last_no, style1:"for_partials.css",style:"account.css", title:"Users page" });
      }  
    }) 
  })
}

exports.userUpdate = (req, res) => {
  
  var status = req.body.status;
  var role = req.body.role;
  var username = req.body.username;
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    //query
    var query = "UPDATE users SET status = ?, role = ? WHERE username = ?;"
        
    connection.query(query,[status, role, username], (err, results) => {
      if (!err) {
        res.redirect('/account/users');
      }  
    }) 
  })
}

exports.userExpert = (req, res) => {

  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    //query
    var query = "SELECT us.username,us.id, us.phone_number, us.avator, us.status, us.created_at, ro.role, ro.role_id FROM users AS us INNER JOIN user_role AS ro ON us.role = ro.role_id WHERE us.role = ?;"

    connection.query(query,[2], (err, users) => {
      if (!err) {
       res.render('user/experts', {userInfo: userInfo,users, style1:"for_partials.css",style:"account.css", title:"Users page" });
      }  
    }) 
  })
}

exports.viewExpertData = (req, res) => {

  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }
  var exp_id = req.params.exp_id
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;
    //query
    var queries = "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price, vc.views FROM audio_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.own_by = ? ORDER BY vc.views;"
    queries += "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price, vc.views FROM video_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.own_by = ? ORDER BY vc.views;"
    queries += "SELECT * FROM books WHERE own_by = ? ORDER BY views;"
    queries += "SELECT pc.payed_amount,pc.created_at, pc.method FROM payment_request AS pr INNER JOIN payment_completed AS pc ON pr.id = pc.order_id WHERE user_id = ? AND pr.status = 'paid';"
    queries += "SELECT us.username, us.id AS user_id, us.avator, us.phone_number, us.created_at AS join_at, pa.number, pm.methode_name FROM users AS us INNER JOIN payment_accounts AS pa ON us.id = pa.user_id INNER JOIN payments_methods AS pm ON pa.method = pm.m_id WHERE us.id = ?;"
    queries += "SELECT SUM(p.amount) AS Total_p FROM audio_courses AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'audio';"
    queries += "SELECT SUM(p.amount) AS Total_p FROM video_courses AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'video';"
    queries += "SELECT SUM(p.amount) AS Total_p FROM books AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'book';"
    queries += "SELECT SUM(p.payed_amount) AS Total_p FROM payment_request AS a INNER JOIN payment_completed AS p ON a.id = p.order_id WHERE a.user_id = ? AND a.status = 'paid';"

    connection.query(queries,[exp_id, exp_id, exp_id, exp_id, exp_id, exp_id, exp_id, exp_id, exp_id], (err, rows) => {
      if (!err) {

        var audios = rows[0]
        var videos = rows[1]
        var books = rows[2]
        var payments = rows[3]
        var p_info = rows[4][0]

        var t_audio = rows[5][0]['Total_p']
        var t_video = rows[6][0]['Total_p']
        var t_book = rows[7][0]['Total_p']
        var t_paid = rows[8][0]['Total_p'] + 0

        var t_earn = t_video + t_audio + t_book + 0;
        var t_balance = (t_earn - t_paid) + 0

        res.render('user/expert_data', {userInfo: userInfo,audios,videos,books,payments,p_info,t_earn,t_balance,t_paid,style1:"for_partials.css",style:"account.css", title:"Users page" });
      }  
    }) 
  })
}