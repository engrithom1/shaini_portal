const pool = require('../config/dbconfig')
var data = require('../data')

var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo
////constroller functions
exports.singleQna = (req, res) => {

  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }

  var slug = req.params.slug

  var post_id = richFunctions.getIdFromSlug(slug)
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err;

    //query
    var query = "SELECT us.username, us.avator, fd.question, fd.slug, fd.views, fd.answer, fd.created_at FROM question_answers AS fd INNER JOIN users AS us ON fd.ask_by = us.id WHERE fd.status = 'active' ORDER BY views ASC LIMIT 6;"
    query += "SELECT us.username, us.avator, fd.question, fd.slug, fd.likes, fd.id, fd.views, fd.answer, fd.created_at FROM question_answers AS fd INNER JOIN users AS us ON fd.ask_by = us.id WHERE fd.id = ?;"
    query += "SELECT us.username, us.avator, fd.answer, fd.likes, fd.id, fd.created_at FROM other_answer AS fd INNER JOIN users AS us ON fd.answer_by = us.id WHERE fd.qna_id = ? ORDER BY fd.likes DESC;"
    

    connection.query(query, [post_id, post_id], (err, results, fields) => {
      
      var qna = results[1][0];
      var qnas = results[0];
      var other_answers = results[2];

      console.log(qna)

      ////seo datas
      var title = qna.question
      var description = qna.answer
          description.substr(0, 200)
      var slug = qna.slug
      
      var views = qna.views
      views = parseInt(views) + 1

      if (!err) {
        connection.query("UPDATE question_answers SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
           if(!err){
              res.render('single/qna', {userInfo: userInfo, qnas, qna,other_answers, style: "for_partials.css", title,description,slug });
           }
        })
        
      } else {
        console.log(err);
      }

      //console.log('the data: \n',rows);
    })
  })
}

exports.accountQna = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT qn.question, qn.id, qn.views, qn.answer_by, qn.status, us.username AS askedby FROM question_answers AS qn INNER JOIN users AS us ON qn.ask_by = us.id ORDER BY qn.answer_by ASC', (err, qnas) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            //console.log(qnas)
            res.render('account/qna',{userInfo:userInfo,qnas,style:"account.css", title:"Question and Answer Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        });
      });
    
}

exports.getQnaEdit = (req, res)=>{
    
  var id = req.params.id
    if(req.session.user){
      userInfo.isLoged = req.session.user.isLoged
      userInfo.user = req.session.user.user
   }

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query("SELECT qn.question, qn.id, qn.views, qn.answer_by, qn.answer, qn.status, us.avator, us.phone_number, us.username AS askedby FROM question_answers AS qn INNER JOIN users AS us ON qn.ask_by = us.id WHERE qn.id = ?",[id], (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            var qna = rows[0]
            res.render('account/qna_answer',{userInfo:userInfo,qna,style:"account.css", title:"Question and Answer Dashbord Update Page"})
          } else {
            console.log("get feed errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createQna = (req, res)=>{

    var { question } = req.body;
    
    var user_id = req.session.user.user.id;


    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO question_answers SET question = ?, ask_by = ?',[question, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(question,id,60)

          connection.query("UPDATE question_answers SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                return res.send('success')
              }else{
                console.log(err);
                return res.send('error')
              }
            })
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
    });
    
}

exports.updateQna = (req, res)=>{
    var { question, answer, status} = req.body;
    
    var user_id = req.session.user.user.id;
    var post_id = req.params.id

    var slug = richFunctions.getSlug(question,post_id,60)

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            //console.log('Connected!');
      
            connection.query('UPDATE question_answers SET question = ?, slug = ?, status = ? , answer = ?, answer_by = ? WHERE id = ?',[question, slug, status, answer, user_id, post_id], (err, rows) => {
              // Once done, release connection
              //connection.release();
      
              if (!err) {
                res.redirect('/account/qna');
              } else {
                console.log("errors---------------------------------------");  
                console.log(err);
              }
      
            });
          });
}


exports.deleteFeed = (req, res)=>{

     var feed_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM feeds  WHERE id = ?',[feed_id], (err, rows) => {
            // Once done, release connection
            //connection.release();
    
            if (!err) {
                return res.send('success');

            } else {
              console.log("errors---------------------------------------");  
              console.log(err);
              return res.send('error');
            }
    
          });
        });
      //return res.status(400).send('No files were uploaded.');
}


