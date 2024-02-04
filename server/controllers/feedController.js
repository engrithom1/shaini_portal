const pool = require('../config/dbconfig')
var data = require('../data')
var path = require('path')


var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo

exports.feedPage = (req, res) => {

  if(req.session.user){
      userInfo.isLoged = req.session.user.isLoged
      userInfo.user = req.session.user.user
   }
  //connect to DB
  pool.getConnection((err, connection) =>{
      if(err) throw err;
      //console.log('Connection as ID '+connection.threadId)

      //query
      var query = "SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' ORDER BY views DESC LIMIT 4;"
      query += "SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' ORDER BY created_at DESC LIMIT 6;"

      connection.query(query, (err, feedz) => {
          
          if(!err){
            const locals = {
              title:"New forum blog posts",
              description:"New forums blog posts"
          }
          var feeds = feedz[0]
          var top_feeds = feedz[1]
              
          res.render('blog/index',{userInfo:userInfo,feeds,top_feeds,locals});
          }else{
              console.log(err);
          }
          
          //console.log('the data: \n',rows);
      })
  })

}

////constroller functions
exports.singleFeed = (req, res) => {

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
    var query = "SELECT us.username, fd.title, fd.thumbnail, fd.views, fd.description, fd.slug, fd.created_at FROM feeds AS fd INNER JOIN users AS us ON fd.created_by = us.id WHERE fd.status = 'active' ORDER BY views ASC LIMIT 3;"
    query += 'SELECT * FROM feeds WHERE id = ?;'
  
    connection.query(query, [post_id], (err, results, fields) => {
      
      var feed = results[1][0];
      var feeds = results[0];

      ////seo datas
      const locals = {
        title:feed.title,
        description:feed.description.substr(0, 150),
        slug : feed.slug
    }
      var views = feed.views
      views = parseInt(views) + 1

      connection.query("UPDATE feeds SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
          if(!err){
             res.render('blog/single', {userInfo: userInfo, feeds, feed, locals});
          }
       })
    
      //console.log('the data: \n',rows);
    })
  })
}

exports.adminBlog = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    var user_id = userInfo.user.id;

    const locals = {
      title:"Blog admin page",
      description:"Blog admin page",
  }

    if(userInfo.user.role == 1){
      var qry = 'SELECT * FROM feeds ORDER BY id DESC'
    }else{
      var qry = 'SELECT * FROM feeds WHERE created_by = '+user_id+' ORDER BY id DESC'
    }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query(qry, (err, rows) => {
          // Once done, release connection
          connection.release();
          var afeeds = rows.filter((i) => i.status == 'active');
          var infeeds = rows.filter((i) => i.status == 'inactive');
          if (!err) {
            res.render('blog/admin',{userInfo:userInfo,infeeds,afeeds,locals})
          } else {
            console.log(err);
            console.log("errors------------------------------------feed");
          }
  
        });

      });
    
}

exports.getFeedEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM feeds WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get feed errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createBlog = (req, res)=>{
    var { title, description, body, slug} = req.body;
    
    var user_id = req.session.user.user.id;
    const dateObj = new Date();
    var month   = dateObj.getUTCMonth() + 1; // months from 1-12
    var year    = dateObj.getUTCFullYear();

    var num = Math.floor(Math.random() * 89) + 10;

    year = year.toString().substr(2);

    var idd = year+""+month+""+num;
    var id = parseInt(idd)

    var slug = richFunctions.getSlug(slug,id,40)
    
    var filename = req.file.filename

    var status = ""
    
    if(req.session.user.user.role == 1){
      status = 'active'
    }else{
      status = 'inactive'
    }
    
    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected

      connection.query('INSERT INTO feeds SET id = ?, slug = ?, title = ?, status = ? , description = ?, thumbnail = ?, created_by = ?',[id, slug, title, status, description, filename, user_id], (err, rows) => {
        if (!err) {
          res.redirect('/blog/admin');
        }  
      });
    });
 
}


exports.updateFeed = (req, res)=>{
    var { title, description, feed_id, status} = req.body;
    
    
    var user_id = req.session.user.user.id;

    var slug = richFunctions.getSlug(title,feed_id,60)

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            //console.log('Connected!');
            if(req.file){

            console.log(req.file)
            var filename = req.file.filename

            connection.query('UPDATE feeds SET title = ?, slug = ?, status = ? , description = ?, thumbnail = ?, created_by = ? WHERE id = ?',[title, slug, status, description, filename, user_id, feed_id], (err, rows) => {
              // Once done, release connection
              //connection.release();
      
              if (!err) {
                res.redirect('/account/feed');
              } else {
                console.log("errors---------------------------------------");  
                console.log(err);
              }
      
            });

            }else{
              connection.query('UPDATE feeds SET title = ?, slug = ?, status = ? , description = ?, created_by = ? WHERE id = ?',[title, slug, status, description, user_id, feed_id], (err, rows) => {
                // Once done, release connection
                //connection.release();
        
                if (!err) {
                  res.redirect('/account/feed');
                } else {
                  console.log("errors---------------------------------------");  
                  console.log(err);
                }
        
              });

            }


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


