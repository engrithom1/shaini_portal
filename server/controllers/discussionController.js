const pool = require('../config/dbconfig')
var data = require('../data')

var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo
////constroller functions
exports.singleDiscussion = (req, res) => {

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
    var query = "SELECT * FROM discussion ORDER BY id DESC LIMIT 6;"
    query += 'SELECT * FROM discussion WHERE id = ?;'
    query += 'SELECT rp.reply, rp.likes, rp.id AS reply_id, us.username, us.avator, rp.user_id AS reply_by FROM replies AS rp INNER JOIN users AS us ON rp.user_id = us.id WHERE rp.post_id = ? ORDER BY rp.id DESC;'

    var dd_query = 'SELECT rp.dd_reply, rp.dd_likes, rp.id AS dd_reply_id, us.username, us.avator, rp.dd_user_id AS reply_by FROM dd_reply AS rp INNER JOIN users AS us ON rp.dd_user_id = us.id WHERE rp.dd_reply_id = ? ORDER BY rp.id DESC;'

    connection.query(query, [post_id,post_id,post_id,post_id], (err, results, fields) => {
      
      var discussion = results[1][0];
      var discussions = results[0];
      var replies = results[2];
      var rep_obj = []
      var len = replies.length

      ////seo datas
      var title = discussion.title
      var description = discussion.description
          description.substr(0, 300)
      var slug = discussion.slug
      
      var views = discussion.views
      views = parseInt(views) + 1

      if(len == 0){
        connection.query("UPDATE discussion SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
          if(!err){
            res.render('single/discussion', {userInfo: userInfo, rep_obj, discussions, discussion, style: "for_partials.css", title,description,slug });
          }
       })
      }

      for(let i = 0;i < len; i++){

        var reply_id = replies[i].reply_id

        connection.query(dd_query, [reply_id], (err, rows, fields) => {
          
          var dd_replies = rows

          var obj = {...replies[i],dd_replies}
          rep_obj.push(obj)

          //req.session.dd_obj = rep_obj

          if(i == len - 1){
            //console.log('let rep obj')
            //console.log(rep_obj)
            connection.query("UPDATE discussion SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
              if(!err){
                res.render('single/discussion', {userInfo: userInfo, rep_obj, discussions, discussion, style: "for_partials.css", title,description,slug });
              }
           })
            //res.render('single/discussion', {userInfo: userInfo, rep_obj, discussions, discussion, style: "for_partials.css", title,description,slug });
          } 
        })

        
      }
    })
  })
}

exports.accountDiscussion = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }

 var user_id = req.session.user.user.id;
 
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM discussion WHERE created_by = ? ORDER BY views DESC',[user_id], (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account/discussion',{userInfo:userInfo,topics:rows,style:"account.css", title:"Discussion Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        });
      });
    
}

exports.getDiscussionEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM discussion WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get discusssion errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createDiscussion = (req, res)=>{
    var { title, description, status} = req.body;
 
    var user_id = req.session.user.user.id;

    var filename = req.file.filename

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO discussion SET title = ?, status = ? , description = ?, thumbnail = ?, created_by = ?',[title, status, description, filename, user_id], (err, rows) => {
   
        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(title,id,60)

          connection.query("UPDATE discussion SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                res.redirect('/account/discussion');
              }else{
                console.log(err);
              }
          })
          
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
    });

}

exports.updateDiscussion = (req, res)=>{
    var { title, description, topic_id, status} = req.body;
   

    var user_id = req.session.user.user.id;

  var slug = richFunctions.getSlug(title,topic_id,60)

    if (!req.file) {
       

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE discussion SET title = ?, slug = ?, status = ? , description = ?, created_by = ? WHERE id = ?',[title, slug, status, description, user_id, topic_id], (err, rows) => {
              if (!err) {
                res.redirect('/account/discussion');
              } else {
                console.log("errors---------------------------------------");  
                console.log(err);
              }
      
            });
          });
        //return res.status(400).send('No files were uploaded.');
    }else{

    var filename = req.file.filename

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('UPDATE discussion SET title = ?, slug = ? , description = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title,slug, description, filename, user_id, topic_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/discussion');
        } else {
          console.log("errors---------------------------------------");  
          console.log(err);
        }

      });
    });

}

    
}


exports.deleteDiscussion = (req, res)=>{

     var topic_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM discussion  WHERE id = ?',[topic_id], (err, rows) => {
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


