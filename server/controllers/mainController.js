const pool = require('../config/dbconfig')
var data = require('../data')

const axios = require('axios')

var userInfo = data.userInfo

//home page
exports.about = (req, res) => {
         
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }

    const locals = {
        title:"About Page",
        description:"New forums about"
    }

    res.render('general/about',{userInfo:userInfo,locals});
}    
//home page
exports.home = (req, res) => {
         
    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }
    var query = "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price FROM video_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.status = 'active' ORDER BY vc.views DESC LIMIT 3;"
        query += "SELECT ac.id, us.username, us.avator, us.id AS user_id, ac.title, ac.slug, ac.thumbnail, ac.price FROM audio_courses AS ac INNER JOIN users AS us ON ac.own_by = us.id  WHERE ac.status = 'active' ORDER BY ac.views DESC LIMIT 3;"
        query += "SELECT * FROM books WHERE status = 'active' ORDER BY views DESC LIMIT 6;" 
        query += "SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' ORDER BY views DESC LIMIT 6;"  
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err){
            console.log(err)
        }
        // select videos
        connection.query(query, (err, results, fields) => {
            if(!err){
               var videos = results[0]
               var audios = results[1]
               var books = results[2]
               var feeds = results[3];

               const locals = {
                title:"New forums for all of you",
                description:"New forums for all of you"
            }
               
               res.render('general/index',{userInfo:userInfo,books,feeds, videos, audios,locals});
               
            }else{ console.log(err)}
        })

       
    })
}

exports.qnaPage = (req, res) => {
       
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query("SELECT us.username, us.avator, fd.question, fd.slug, fd.views, fd.answer, fd.created_at FROM question_answers AS fd INNER JOIN users AS us ON fd.ask_by = us.id WHERE fd.status = 'active' ORDER BY views ASC LIMIT 6;", (err, qnas) => {
            
            if(!err){
                
                res.render('qnas',{userInfo:userInfo, style:"for_partials.css", qnas, title:"experts wisdom, Questions and answers from akiliforum.com"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.discussionPage = (req, res) => {
    
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;

        connection.query("SELECT * FROM discussion WHERE status = 'active' ORDER BY views DESC", (err, discussions) => {
            connection.release();
            
            if(!err){
                
                res.render('discussions',{userInfo:userInfo, style:"for_partials.css", discussions, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//audio page
exports.audioPage = (req, res) => {
     
    
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)
        
        //query
        connection.query("SELECT ac.id, us.username, us.avator, us.id AS user_id, ac.title, ac.slug, ac.thumbnail, ac.price FROM audio_courses AS ac INNER JOIN users AS us ON ac.own_by = us.id  WHERE ac.status = 'active' ORDER BY ac.views DESC;", (err, audios) => {
           
            if(!err){
                
                res.render('audios',{userInfo:userInfo, style:"for_partials.css", audios, title:"Audio Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//video page
exports.videoPage = (req, res) => {
     
    
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query("SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price FROM video_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.status = 'active' ORDER BY vc.views DESC;", (err, videos) => {
           
            if(!err){
                
                res.render('videos',{userInfo:userInfo, style:"for_partials.css", videos, title:"Video Courses for you"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

//video page
exports.bookPage = (req, res) => {
         
    if (req.session.user) {
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
      }
    //connect to DB
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        //console.log('Connection as ID '+connection.threadId)

        //query
        connection.query("SELECT * FROM books WHERE status = 'active' ORDER BY views DESC", (err, books) => {
            
            if(!err){
                
                res.render('books',{userInfo:userInfo,style:"for_partials.css", books, title:"Books available for your"});
            }else{
                console.log(err);
            }
            
            //console.log('the data: \n',rows);
        })
    })

}

exports.accountPage = (req, res) =>{
    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
     }

    var user_id = req.session.user.user.id;

    var time = new Date()
    var now_sec = Math.round(time.getTime() / 1000)

    var queries = "SELECT fv.post_id, ac.title, ac.slug, ac.thumbnail, ac.price, ac.views, ac.id, us.username, us.avator, us.id AS user_id FROM favorities AS fv INNER JOIN audio_courses AS ac ON fv.post_id = ac.id INNER JOIN users AS us ON ac.own_by = us.id WHERE fv.user_id = ? AND ac.status = 'active';"
        queries += "SELECT fv.post_id, ac.title, ac.slug, ac.thumbnail, ac.price, ac.views, ac.id, us.username, us.avator, us.id AS user_id FROM favorities AS fv INNER JOIN video_courses AS ac ON fv.post_id = ac.id INNER JOIN users AS us ON ac.own_by = us.id WHERE fv.user_id = ? AND ac.status = 'active';"
        queries += "SELECT fv.post_id, ac.title, ac.slug, ac.thumbnail, ac.price, ac.views, ac.id, us.username, us.avator, us.id AS user_id FROM favorities AS fv INNER JOIN books AS ac ON fv.post_id = ac.id INNER JOIN users AS us ON ac.own_by = us.id WHERE fv.user_id = ? AND ac.status = 'active';"
        queries += "SELECT fv.post_id, ac.title, ac.slug, ac.thumbnail, ac.price, ac.views, ac.id, us.username, us.avator, us.id AS user_id FROM payed AS fv INNER JOIN books AS ac ON fv.post_id = ac.id INNER JOIN users AS us ON ac.own_by = us.id WHERE fv.user_id = ? AND ac.status = 'active' AND fv.time_sec > ?;"
        queries += "SELECT fv.post_id, ac.title, ac.slug, ac.thumbnail, ac.price, ac.views, ac.id, us.username, us.avator, us.id AS user_id FROM payed AS fv INNER JOIN video_courses AS ac ON fv.post_id = ac.id INNER JOIN users AS us ON ac.own_by = us.id WHERE fv.user_id = ? AND ac.status = 'active' AND fv.time_sec > ?;"
        queries += "SELECT fv.post_id, ac.title, ac.slug, ac.thumbnail, ac.price, ac.views, ac.id, us.username, us.avator, us.id AS user_id FROM payed AS fv INNER JOIN audio_courses AS ac ON fv.post_id = ac.id INNER JOIN users AS us ON ac.own_by = us.id WHERE fv.user_id = ? AND ac.status = 'active' AND fv.time_sec > ?;"
        queries += "SELECT order_id, post_type, post_id, status, amount, user_id FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 1;"
        queries += "SELECT oq.id, oq.answer, oq.likes, qq.question FROM other_answer AS oq INNER JOIN question_answers AS qq ON oq.qna_id = qq.id WHERE oq.answer_by = ? ORDER BY likes DESC;"
        queries += "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price, vc.views FROM audio_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.own_by = ? ORDER BY vc.views;"
        queries += "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price, vc.views FROM video_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.own_by = ? ORDER BY vc.views;"
        queries += "SELECT * FROM books WHERE own_by = ? ORDER BY views;"
        queries += "SELECT SUM(p.amount) AS Total_p FROM audio_courses AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'audio';"
        queries += "SELECT SUM(p.amount) AS Total_p FROM video_courses AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'video';"
        queries += "SELECT SUM(p.amount) AS Total_p FROM books AS a INNER JOIN payed AS p ON a.id = p.post_id WHERE a.own_by = ? AND p.post_type = 'book';"
        queries += "SELECT SUM(p.payed_amount) AS Total_p FROM payment_request AS a INNER JOIN payment_completed AS p ON a.id = p.order_id WHERE a.user_id = ? AND a.status = 'paid';"
        queries += "SELECT a.method, a.number, m.methode_name FROM payment_accounts AS a INNER JOIN payments_methods AS m ON a.method = m.m_id WHERE a.user_id = ? LIMIT 1;"
        queries += "SELECT * FROM payments_methods;"
        queries += "SELECT amount FROM payment_request WHERE user_id = ? AND status = 'pending' ORDER BY id DESC LIMIT 1;"
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query(queries,[user_id,user_id,user_id,user_id,now_sec,user_id,now_sec,user_id,now_sec,user_id,user_id,user_id,user_id,user_id,user_id,user_id,user_id,user_id,user_id,user_id], (err, rows) => {
       
          if (!err) {
            
            var audios = rows[0]
            var videos = rows[1]
            var books = rows[2]
            var payed_books = rows[3]
            var payed_videos = rows[4]
            var payed_audios = rows[5]
            var pending = rows[6]
            var qna_answers = rows[7]
            var my_audios = rows[8]
            var my_videos = rows[9]
            var my_books = rows[10]
            var t_audio = rows[11][0]['Total_p']
            var t_video = rows[12][0]['Total_p']
            var t_book = rows[13][0]['Total_p']
            var t_paid = rows[14][0]['Total_p'] + 0
            var my_account = rows[15][0]
            var accounts = rows[16]
            var p_request = rows[17][0]

            if(pending.length != 0){
                if(pending[0].status == 'paid'){
                    pending = []
                }
            }

            var t_earn = t_video + t_audio + t_book + 0;
            var t_balance = (t_earn - t_paid) + 0

            //console.log(t_paid)
            
            res.render('account',{userInfo:userInfo,audios,videos,books,pending, payed_books,payed_videos,payed_audios,qna_answers,my_audios,my_videos,my_books,t_earn, t_paid,t_balance,my_account,accounts,p_request, style1:"for_partials.css", style:"account.css", title:"Account Profile page"});
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        }); 
      });
    
}

exports.searchPage = (req, res) =>{

    var key_word = req.body.search;
    var strArry = key_word.split(" ")

    var key1, key2, key3

    if(strArry.length >= 3){
        key1 = strArry[0]
        key2 = strArry[1]
        key3 = strArry[2]
    }

    if(strArry.length >= 2){
        key1 = strArry[0]
        key2 = strArry[1]
        key3 = key1
    }

    if(strArry.length >= 1){
        key1 = strArry[0]
        key2 = key1
        key3 = key2
    }

    if(req.session.user){
        userInfo.isLoged = req.session.user.isLoged
        userInfo.user = req.session.user.user
    }

    var query = "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price FROM video_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.status = 'active' AND vc.title LIKE ?  OR vc.title LIKE ? OR vc.title LIKE ? ORDER BY vc.views DESC;"
        query += "SELECT ac.id, us.username, us.avator, us.id AS user_id, ac.title, ac.slug, ac.thumbnail, ac.price FROM audio_courses AS ac INNER JOIN users AS us ON ac.own_by = us.id  WHERE ac.status = 'active' AND ac.title LIKE ?  OR ac.title LIKE ? OR ac.title LIKE ? ORDER BY ac.views DESC;"
        query += "SELECT * FROM books WHERE status = 'active' AND title LIKE ?  OR title LIKE ? OR title LIKE ? ORDER BY views DESC;" 
        query += "SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' AND fd.title LIKE ?  OR fd.title LIKE ? OR fd.title LIKE ? ORDER BY views DESC;" 
        query += "SELECT * FROM discussion WHERE status = 'active' AND title LIKE ?  OR title LIKE ? OR title LIKE ? ORDER BY views DESC;"
        query += "SELECT us.username, us.avator, fd.question, fd.slug, fd.views, fd.answer, fd.created_at FROM question_answers AS fd INNER JOIN users AS us ON fd.ask_by = us.id WHERE fd.status = 'active' AND fd.question LIKE ?  OR fd.question LIKE ? OR fd.question LIKE ? ORDER BY views DESC;"
         
        
        pool.getConnection((err, connection) => {
        if (err) throw err; // not connected 0716715773
        //console.log('Connected!');
  
        connection.query(query,['%'+key1+'%','%'+key2+'%','%'+key3+'%','%'+key1+'%','%'+key2+'%','%'+key3+'%','%'+key1+'%','%'+key2+'%','%'+key3+'%','%'+key1+'%','%'+key2+'%','%'+key3+'%','%'+key1+'%','%'+key2+'%','%'+key3+'%','%'+key1+'%','%'+key2+'%','%'+key3+'%'], (err, rows) => {
       
          if (!err) {
            
            var audios = rows[1]
            var videos = rows[0]
            var books = rows[2]
            var feeds = rows[3]
            var discussions = rows[4]
            var qnas = rows[5]
            
            res.render('search',{userInfo:userInfo,audios,videos,books,feeds,qnas,key_word,discussions, style1:"for_partials.css", title:"Account Profile page"});
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        }); 
      });
    
}

