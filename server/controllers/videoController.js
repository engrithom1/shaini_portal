const pool = require('../config/dbconfig')
var data = require('../data')
var richFunctions = require('../richardFunctions')

var userInfo = data.userInfo
///user pages functions
exports.videos = (req, res) => {
         
  if(req.session.user){
     userInfo.isLoged = req.session.user.isLoged
     userInfo.user = req.session.user.user
  }

  const locals = {
      title:"videos Page",
      description:"New forums about"
  }

  res.render('courses/videos',{userInfo:userInfo,locals});
}

exports.singleVideo = (req, res) => {

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
    var query = "SELECT vc.id, us.username, us.avator, us.id AS user_id, vc.title, vc.slug, vc.thumbnail, vc.price FROM video_courses AS vc INNER JOIN users AS us ON vc.own_by = us.id  WHERE vc.status = 'active' ORDER BY vc.views ASC LIMIT 4;"
    query += 'SELECT * FROM video_lists WHERE course_id = ? ORDER BY order_number ASC;'
    query += 'SELECT * FROM video_courses WHERE id = ?;'
    query += 'SELECT cm.comment, cm.likes, cm.id AS comment_id,  us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.post_id = ? AND cm.type = ? ORDER BY cm.id DESC;'

    var dd_query = 'SELECT rp.dd_comment, rp.dd_likes, rp.id AS dd_id, us.username, us.avator, rp.dd_user_id AS comment_by FROM dd_comments AS rp INNER JOIN users AS us ON rp.dd_user_id = us.id WHERE rp.dd_comment_id = ? ORDER BY rp.id DESC;'

    connection.query(query, [post_id,post_id,post_id,'video'], (err, results, fields) => {
      
      var course = results[2][0];
      var videos = results[0];
      var video_list = results[1];
      var replies = results[3];

      var rep_obj = []
      var len = replies.length
      ////seo datas
      var title = course.title
      var description = course.description
          description.substr(0, 200)
      var slug = course.slug
      
      var views = course.views
      views = parseInt(views) + 1

      if(len == 0){
        connection.query("UPDATE video_courses SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
          if(!err){
             res.render('single/video', {userInfo: userInfo, rep_obj, videos, video_list, course, style: "for_partials.css", title,description,slug });
          }
          if(err){
            console.log(err)
         }
       })
      }

      for(let i = 0;i < len; i++){

        var reply_id = replies[i].comment_id

        connection.query(dd_query, [reply_id], (err, rows, fields) => {
          
          if(err){
             console.log(err)
          }
          var dd_replies = rows

          var obj = {...replies[i],dd_replies}
          rep_obj.push(obj)

          console.log('let rep obj')
          console.log(rep_obj)

          

          if(i == len - 1){
            connection.query("UPDATE video_courses SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
              if(!err){
                 res.render('single/video', {userInfo: userInfo, rep_obj, videos, video_list, course, style: "for_partials.css", title,description,slug });
              }
              if(err){
                console.log(err)
             }
           })
           
          } 
        })

        
      }
        
     

      //console.log('the data: \n',rows);
    })
  })
}

////admin panel constroller functions
exports.accountVideo = (req, res) => {

  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    //console.log('Connected!');

    connection.query('SELECT vd.title, vd.slug, vd.description, vd.thumbnail, vd.price,vd.status, vd.views, vd.id, vd.own_by, us.username FROM video_courses AS vd INNER JOIN users AS us ON vd.own_by = us.id', (err, rows) => {
      // Once done, release connection
      //connection.release();
    
      if (!err) {
        //console.log(rows)
        res.render('account/video', { userInfo: userInfo, videos: rows, style: "account.css", title: "Video Dashbord Page" })
      } else {
        console.log(err);
        console.log("errors------------------------------------videpo");
      }

    });
  });

}

exports.getVideoEdit = (req, res) => {
  var id = req.body.id

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('SELECT vd.title, vd.slug, vd.description, vd.thumbnail, vd.price,vd.status, vd.views, vd.id, vd.own_by, us.username AS owner FROM video_courses AS vd INNER JOIN users AS us ON vd.own_by = us.id WHERE vd.id = ' + id, (err, rows) => {
      // Once done, release connection
      //connection.release();
      if (!err) {
        return res.json(rows);
      } else {
        console.log("get video errors---------------------------------------");
        console.log(err);
      }

    });
  });

}

exports.createVideo = (req, res) => {
  var { title, description, price, status, own_by } = req.body;

  var user_id = req.session.user.user.id;
  var filename = req.file.filename

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('SELECT * FROM users WHERE id = ? AND role > 0',[own_by],(err, rows) => {
         
        if (err) throw err;
        if(rows.length > 0){
      connection.query('INSERT INTO video_courses SET title = ?, status = ? , description = ? , price = ?, thumbnail = ?, created_by = ?, own_by = ?', [title, status, description, price, filename, user_id, own_by], (err, rows) => {
        // Once done, release connection
        //connection.release();
        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(title,id,60)

          connection.query("UPDATE video_courses SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                res.redirect('/account/video');
              }else{
                console.log(err);
              }
          })
          
        } else {
          console.log("errors---------------------------------------");
          console.log(err);
        }

      });

    }else{
      res.redirect('/account/video');
    }
  })

    });

}

exports.updateVideo = (req, res) => {
  var { title, description, price, post_id, status, own_by } = req.body;
  var time = new Date()
  let imageFile
  let uploadPath
  var user_id = req.session.user.user.id;

  var slug = richFunctions.getSlug(title,post_id,60)

  if (!req.file) {

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('SELECT * FROM users WHERE id = ? AND role > 0',[own_by],(err, rows) => {
         
        if (err) throw err;
        if(rows.length > 0){
        connection.query('UPDATE video_courses SET title = ?, status = ? , description = ? , price = ?, created_by = ?, slug = ?, own_by = ? WHERE id = ?', [title, status, description, price, user_id, slug, own_by, post_id], (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.redirect('/account/video');
          } else {
            console.log("errors---------------------------------------");
            console.log(err);
          }
  
        });
        }else{
          res.redirect('/account/video');
        }
      })
      });
    //return res.status(400).send('No files were uploaded.');
  } else {

      var filename = req.file.filename

      pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');

        connection.query('SELECT * FROM users WHERE id = ? AND role > 0',[own_by],(err, rows) => {
         
          if (err) throw err;
          if(rows.length > 0){
        connection.query('UPDATE video_courses SET title = ? , description = ? , price = ?, thumbnail = ?, created_by = ?, slug = ?, own_by = ? WHERE id = ?', [title, description, price, filename, user_id, slug, own_by, post_id], (err, rows) => {
          // Once done, release connection
          //connection.release();

          if (!err) {
            res.redirect('/account/video');
          } else {
            console.log("errors---------------------------------------");
            console.log(err);
          }

        });
      }else{
        res.redirect('/account/video');
      }
    })
      });
  }


}

////constroller functions
exports.accountVideoList = (req, res) => {
  if (req.session.user) {
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
  }
  var video_id = req.params.id

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    //console.log('Connected!');

    connection.query('SELECT * FROM video_courses WHERE id = ?', [video_id], (err, video) => {
      console.log(video_id)
      //connection.release();

      if (!err) {
        connection.query('SELECT * FROM video_lists WHERE course_id = ? ORDER BY order_number ASC', [video_id], (err, rows) => {
          if (!err) {
            res.render('account/video_list', { userInfo: userInfo, video: video[0], vlist: rows, style: "account.css", title: "Video Dashbord Page" })
          } else {
            console.log(err);
            console.log("errors------------------------------------videpo");
          }

        })

      } else {
        console.log(err);
        console.log("errors------------------------------------videpo");
      }

    });
  });

}

exports.createVideolist = (req, res) => {
  video_id = req.params.id
  var { sub_title, order_number, label, video_url } = req.body;

  console.log("this values "+sub_title+", "+order_number+", "+label+", "+video_url)

  //var filename = req.file.filename

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO video_lists SET sub_title = ? , order_number = ? , label = ?, video_url = ?, course_id = ?', [sub_title, order_number, label, video_url, video_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          res.redirect('/account/video-list/' + video_id);
        } else {
          console.log("errors---------------------------------------");
          console.log(err);
        }

      });
    });

}

exports.getVideoListEdit = (req, res) => {
  var id = req.body.id

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('SELECT * FROM video_lists WHERE id = ' + id, (err, rows) => {
      // Once done, release connection
      //connection.release();
      if (!err) {
        return res.json(rows);
      } else {
        console.log("get video errors---------------------------------------");
        console.log(err);
      }

    });
  });

}

exports.updateVideoList = (req, res) => {
  var { sub_title, order_number, label, course_id, video_id, video_url } = req.body;


  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('UPDATE video_lists SET sub_title = ?, order_number = ?, label = ?, video_url = ? WHERE id = ?', [sub_title, order_number, label,video_url, video_id], (err, rows) => {
      // Once done, release connection
      //connection.release();

      if (!err) {
        res.redirect('/account/video-list/'+course_id);
      } else {
        console.log("errors---------------------------------------");
        console.log(err);
      }

    });
  });
  //return res.status(400).send('No files were uploaded.');
}

exports.deleteVideo = (req, res) => {

  var video_id = req.body.id;


  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('DELETE FROM video_courses WHERE id = ?', [video_id], (err, rows) => {
      // Once done, release connection
      //connection.release();

      if (!err) {
        connection.query('DELETE FROM video_lists  WHERE course_id = ?', [video_id], (err, rows) => {

          if (!err) {
            return res.send('success');
          } else {
            return res.send('error');
          }
        })

      } else {
        console.log("errors---------------------------------------");
        console.log(err);
        return res.send('error');
      }

    });
  });
  //return res.status(400).send('No files were uploaded.');
}

exports.deleteVideoList = (req, res) => {

  var video_id = req.body.id;


  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('DELETE FROM video_lists  WHERE id = ?', [video_id], (err, rows) => {
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
