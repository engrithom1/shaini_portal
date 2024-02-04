const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo

exports.favoriteCourse = (req, res) =>{

  var {post_id, post_type, user_id} = req.body

  
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query("SELECT * FROM favorities WHERE post_id = ? AND user_id = ?",[post_id, user_id],(err, rows) =>{
        if(!err){
           
          var zipo = rows.length
          
          if(zipo != 0){
            console.log("vipo manaaaa")
            console.log(zipo)
              connection.query("DELETE FROM favorities WHERE post_id = ? AND user_id = ?",[post_id, user_id],(err, rows)=>{
                if (err) throw err;
                return res.send({action:'delete'})
              })
          }else{
            console.log("havimoooooo")
            console.log(zipo)
              connection.query("INSERT INTO favorities SET post_id = ?, user_id = ?, post_type = ?",[post_id, user_id, post_type],(err, rows)=>{
                if (err) throw err;
                return res.send({action:'insert'})
              })
          }
        }else{
          console.log(err)
        }
    })
  })  

}

exports.likeComment = (req, res)=>{

    console.log(req.session.user)
    var comment_id = req.body.comment_id
    var comment_by = req.body.comment_by
    var user_id = req.session.user.user.id


    var query = "UPDATE comments SET likes = ? WHERE id = ?;"
        query += "INSERT INTO comment_likes  SET comment_by = ?, comment_id = ?, like_by = ?;"

    var exist_query = "UPDATE comments SET likes = ? WHERE id = ?;"
        exist_query += "DELETE FROM comment_likes WHERE comment_id = ? AND like_by = ?;"    

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected console.log('Connected!');
      
      connection.query("SELECT likes FROM comments WHERE id = ?",[comment_id], (err, rows) =>{
          
        if(!err){
          var likes = rows[0].likes
          

          connection.query("SELECT * FROM comment_likes WHERE comment_id = ? AND like_by = ?",[comment_id, user_id], (err, rows) =>{
              if(!err){

                  if(rows.length == 0){
                    likes = parseInt(likes) + 1

                    connection.query(query,[likes, comment_id, comment_by, comment_id, user_id], (err, rows) =>{
                      if(!err){
                      return res.send('like')
                      }else{
                        console.log(err)
                      }
                    })

                  }else{

                    likes = parseInt(likes) - 1

                    connection.query(exist_query,[likes, comment_id, comment_id, user_id], (err, rows) =>{
                      if(!err){
                        return res.send('exist')
                      }else{
                        console.log(err)
                      }
                    })  
                  }
              }else{
                 console.log(err)
              }
          })

        }else{
          console.log(err)
        }

      })

    })  

    console.log(req.session.user)

}

exports.likeReply = (req, res)=>{

  console.log(req.session.user)
  var reply_id = req.body.reply_id
  var reply_by = req.body.reply_by
  var user_id = req.session.user.user.id


  var query = "UPDATE replies SET likes = ? WHERE id = ?;"
      query += "INSERT INTO reply_likes  SET reply_by = ?, reply_id = ?, like_by = ?;"

  var exist_query = "UPDATE replies SET likes = ? WHERE id = ?;"
      exist_query += "DELETE FROM reply_likes WHERE reply_id = ? AND like_by = ?;"    

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected console.log('Connected!');
    
    connection.query("SELECT likes FROM replies WHERE id = ?",[reply_id], (err, rows) =>{
        
      if(!err){
        var likes = rows[0].likes
        

        connection.query("SELECT * FROM reply_likes WHERE reply_id = ? AND like_by = ?",[reply_id, user_id], (err, rows) =>{
            if(!err){

                if(rows.length == 0){
                  likes = parseInt(likes) + 1

                  connection.query(query,[likes, reply_id, reply_by, reply_id, user_id], (err, rows) =>{
                    if(!err){
                    return res.send('like')
                    }else{
                      console.log(err)
                    }
                  })

                }else{

                  likes = parseInt(likes) - 1

                  connection.query(exist_query,[likes, reply_id, reply_id, user_id], (err, rows) =>{
                    if(!err){
                      return res.send('exist')
                    }else{
                      console.log(err)
                    }
                  })  
                }
            }else{
               console.log(err)
            }
        })

      }else{
        console.log(err)
      }

    })

  })  

  console.log(req.session.user)

}

exports.DDlikeReply = (req, res)=>{

  console.log(req.session.user)
  var reply_id = req.body.reply_id
  var reply_by = req.body.reply_by
  var user_id = req.session.user.user.id


  var query = "UPDATE dd_reply SET dd_likes = ? WHERE id = ?;"
      query += "INSERT INTO dd_reply_likes  SET reply_by = ?, reply_id = ?, like_by = ?;"

  var exist_query = "UPDATE dd_reply SET dd_likes = ? WHERE id = ?;"
      exist_query += "DELETE FROM dd_reply_likes WHERE reply_id = ? AND like_by = ?;"    

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected console.log('Connected!');
    
    connection.query("SELECT dd_likes FROM dd_reply WHERE id = ?",[reply_id], (err, rows) =>{
        
      if(!err){
        var likes = rows[0].dd_likes
        

        connection.query("SELECT * FROM dd_reply_likes WHERE reply_id = ? AND like_by = ?",[reply_id, user_id], (err, rows) =>{
            if(!err){

                if(rows.length == 0){
                  likes = parseInt(likes) + 1

                  connection.query(query,[likes, reply_id, reply_by, reply_id, user_id], (err, rows) =>{
                    if(!err){
                    return res.send('like')
                    }else{
                      console.log(err)
                    }
                  })

                }else{

                  likes = parseInt(likes) - 1

                  connection.query(exist_query,[likes, reply_id, reply_id, user_id], (err, rows) =>{
                    if(!err){
                      return res.send('exist')
                    }else{
                      console.log(err)
                    }
                  })  
                }
            }else{
               console.log(err)
            }
        })

      }else{
        console.log(err)
      }

    })

  })  

  console.log(req.session.user)

}
exports.DDlikeComment = (req, res)=>{

  console.log(req.session.user)
  var reply_id = req.body.reply_id
  var reply_by = req.body.reply_by
  var user_id = req.session.user.user.id


  var query = "UPDATE dd_comments SET dd_likes = ? WHERE id = ?;"
      query += "INSERT INTO dd_comment_likes  SET comment_by = ?, comment_id = ?, like_by = ?;"

  var exist_query = "UPDATE dd_comments SET dd_likes = ? WHERE id = ?;"
      exist_query += "DELETE FROM dd_comment_likes WHERE comment_id = ? AND like_by = ?;"    

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected console.log('Connected!');
    
    connection.query("SELECT dd_likes FROM dd_comments WHERE id = ?",[reply_id], (err, rows) =>{
        
      if(!err){
        var likes = rows[0].dd_likes
        

        connection.query("SELECT * FROM dd_comment_likes WHERE comment_id = ? AND like_by = ?",[reply_id, user_id], (err, rows) =>{
            if(!err){

                if(rows.length == 0){
                  likes = parseInt(likes) + 1

                  connection.query(query,[likes, reply_id, reply_by, reply_id, user_id], (err, rows) =>{
                    if(!err){
                    return res.send('like')
                    }else{
                      console.log(err)
                    }
                  })

                }else{

                  likes = parseInt(likes) - 1

                  connection.query(exist_query,[likes, reply_id, reply_id, user_id], (err, rows) =>{
                    if(!err){
                      return res.send('exist')
                    }else{
                      console.log(err)
                    }
                  })  
                }
            }else{
               console.log(err)
            }
        })

      }else{
        console.log(err)
      }

    })

  })  

  console.log(req.session.user)

}

exports.likeQna = (req, res)=>{

  //console.log(req.session.user)
  var qna_id = req.body.qna_id
  var user_id = req.session.user.user.id


  var query = "UPDATE question_answers SET likes = ? WHERE id = ?;"
      query += "INSERT INTO qna_likes  SET qna_id = ?, like_by = ?;"

  var exist_query = "UPDATE question_answers SET likes = ? WHERE id = ?;"
      exist_query += "DELETE FROM qna_likes WHERE qna_id = ? AND like_by = ?;"    

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected console.log('Connected!');
    
    connection.query("SELECT likes FROM question_answers WHERE id = ?",[qna_id], (err, rows) =>{
        
      if(!err){
        var likes = rows[0].likes
        

        connection.query("SELECT * FROM qna_likes WHERE qna_id = ? AND like_by = ?",[qna_id, user_id], (err, rows) =>{
            if(!err){

                if(rows.length == 0){
                  likes = parseInt(likes) + 1

                  connection.query(query,[likes, qna_id, qna_id, user_id], (err, rows) =>{
                    if(!err){
                    return res.send('like')
                    }else{
                      console.log(err)
                    }
                  })

                }else{

                  likes = parseInt(likes) - 1

                  connection.query(exist_query,[likes, qna_id, qna_id, user_id], (err, rows) =>{
                    if(!err){
                      return res.send('exist')
                    }else{
                      console.log(err)
                    }
                  })  
                }
            }else{
               console.log(err)
            }
        })

      }else{
        console.log(err)
      }

    })

  })  

  console.log(req.session.user)

}

exports.allInOneComment = (req, res)=>{

    var post_id = req.body.post_id
    var post_type = req.body.post_type
    var comment = req.body.comment
    var user_id = req.session.user.user.id

    console.log(req.session.user)

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('INSERT INTO comments SET comment = ?, type = ? , post_id = ? , user_id = ?',[comment, post_type, post_id, user_id], (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            var comment_id = rows.insertId
            connection.query('SELECT cm.comment, cm.likes, cm.id AS comment_id, us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.id = ?;',[ comment_id], (err, rows) => {
               if(!err){
                var commentz = rows[0];
                console.log(commentz)
                var comment = commentz.comment
                var likes = commentz.likes
                var comment_id = commentz.comment_id
                var comment_by = commentz.comment_by
                var avator = commentz.avator
                var username = commentz.username
                return res.render('partials/comment',{layout:false,comment,likes,comment_id,comment_by,avator,username})
               }else{
                console.log(err);
               }
            })
            
          } else {
            console.log("get video errors---------------------------------------");  
            console.log(err);
          }
  
        });
    });
    
}

exports.discussionReply = (req, res)=>{

  var post_id = req.body.post_id
  var comment = req.body.comment
  var user_id = req.session.user.user.id

  //console.log(req.session.user)
var query = "SELECT rp.reply, rp.likes, rp.id AS reply_id,  us.username, us.avator, rp.user_id AS reply_by FROM replies AS rp INNER JOIN users AS us ON rp.user_id = us.id WHERE rp.id = ?;"
    query += "SELECT replies FROM discussion WHERE id = ?;"

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO replies SET reply = ? , post_id = ? , user_id = ?',[comment, post_id, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();
        if (!err) {
          var reply_id = rows.insertId
          connection.query(query,[reply_id, post_id], (err, rows) => {
             if(!err){
              console.log(rows)
              var replies = rows[0][0]
              var reps = rows[1][0].replies
              var reps = reps + 1

              //console.log(commentz)
              var reply = replies.reply
              var likes = replies.likes
              var reply_id = replies.reply_id
              var reply_by = replies.reply_by
              var avator = replies.avator
              var username = replies.username

              connection.query("UPDATE discussion SET replies = ? WHERE id = ?",[reps,post_id],(err,rows)=>{
                if(!err){
                  return res.render('partials/d_reply',{layout:false,reply,likes,reply_by,reply_id,avator,username})
                }
              })
             }else{
              console.log(err);
             }
          })
          
        } else {
          console.log("get video errors---------------------------------------");  
          console.log(err);
        }

      });
  });
  
}

exports.discussionDDReply = (req, res)=>{
  
  var post_id = req.body.post_reply_id
  var comment = req.body.dd_reply
  var user_id = req.session.user.user.id

  //console.log(req.session.user)
var query = "SELECT rp.dd_reply, rp.dd_likes, rp.id AS reply_id,  us.username, us.avator, rp.dd_user_id AS reply_by FROM dd_reply AS rp INNER JOIN users AS us ON rp.dd_user_id = us.id WHERE rp.id = ?;"

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO dd_reply SET dd_reply = ? , dd_reply_id = ? , dd_user_id = ?',[comment, post_id, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();
        if (!err) {
          var reply_id = rows.insertId
          connection.query(query,[reply_id], (err, rows) => {
             if(!err){
              console.log(rows)
              var replies = rows[0]
              

              //console.log(commentz)
              var reply = replies.dd_reply
              var likes = replies.dd_likes
              var reply_id = replies.reply_id
              var reply_by = replies.reply_by
              var avator = replies.avator
              var username = replies.username

                return res.render('partials/dd_reply',{layout:false,reply,likes,reply_by,reply_id,avator,username})
             }else{
              console.log(err);
             }
          })
          
        } else {
          console.log("get video errors---------------------------------------");  
          console.log(err);
        }

      });
  });
  
}
//this is for feed, video, audio and books
exports.allDDReply = (req, res)=>{
  
  var post_id = req.body.post_reply_id
  var comment = req.body.dd_reply
  var user_id = req.session.user.user.id

  //console.log(req.session.user)
var query = "SELECT rp.dd_comment, rp.dd_likes, rp.id AS dd_id, us.username, us.avator, rp.dd_user_id AS comment_by FROM dd_comments AS rp INNER JOIN users AS us ON rp.dd_user_id = us.id WHERE rp.id = ?;"

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO dd_comments SET dd_comment = ? , dd_comment_id = ? , dd_user_id = ?',[comment, post_id, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();
        if (!err) {
          var reply_id = rows.insertId
          connection.query(query,[reply_id], (err, rows) => {
             if(!err){
              console.log(rows)
              var replies = rows[0]
              

              //console.log(commentz)
              var comment = replies.dd_comment
              var likes = replies.dd_likes
              var comment_id = replies.dd_id
              var comment_by = replies.comment_by
              var avator = replies.avator
              var username = replies.username

                return res.render('partials/dd_comment',{layout:false,comment,likes,comment_by,comment_id,avator,username})
             }else{
              console.log(err);
             }
          })
          
        } else {
          console.log("get video errors---------------------------------------");  
          console.log(err);
        }

      });
  });
  
}

exports.addAnswer = (req, res)=>{

  var post_id = req.body.post_id
  var answer = req.body.comment
  var user_id = req.session.user.user.id

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected

      connection.query('SELECT * FROM other_answer WHERE qna_id = ? AND answer_by = ?',[post_id, user_id], (err, rows) => {
        if (err) throw err;

        if(rows.length > 0){
          return res.send('<h6 class="text-danger">Huwezi kujibu swali hili mara mbili edit jibu ktk account yako</h6>')

        }else{

          connection.query('INSERT INTO other_answer SET answer = ?, qna_id = ? , answer_by = ?',[answer, post_id, user_id], (err, rows) => {
            // Once done, release connection
            //connection.release();
            if (!err) {
              var comment_id = rows.insertId
              connection.query('SELECT cm.answer, cm.likes,cm.created_at, cm.id AS answer_id, us.username, us.avator, cm.answer_by FROM other_answer AS cm INNER JOIN users AS us ON cm.answer_by = us.id WHERE cm.id = ?;',[ comment_id], (err, rows) => {
                 if(!err){
                  var answerz = rows[0];
                  console.log(answerz)
                  var answer = answerz.answer
                  var likes = answerz.likes
                  var id = answerz.answer_id
                  var answer_by = answerz.answer_by
                  var avator = answerz.avator
                  var username = answerz.username
                  var created_at = answerz.created_at
                  return res.render('partials/other_qna',{layout:false,answer,likes,created_at,id,answer_by,avator,username})
                 }else{
                  console.log(err);
                 }
              })
              
            } else {
              console.log("get video errors---------------------------------------");  
              console.log(err);
            }
    
          });
        }

      })
  });
  
}

exports.likeOtherQna = (req, res)=>{

  //console.log(req.session.user)
  var qna_id = req.body.qna_id
  var user_id = req.session.user.user.id


  var query = "UPDATE other_answer SET likes = ? WHERE id = ?;"
      query += "INSERT INTO other_answer_like  SET other_qna_id = ?, liked_by = ?;"

  var exist_query = "UPDATE other_answer SET likes = ? WHERE id = ?;"
      exist_query += "DELETE FROM other_answer_like WHERE other_qna_id = ? AND liked_by = ?;"    

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected console.log('Connected!');
    
    connection.query("SELECT likes FROM other_answer WHERE id = ?",[qna_id], (err, rows) =>{
        
      if(!err){
        var likes = rows[0].likes
        connection.query("SELECT * FROM other_answer_like WHERE other_qna_id = ? AND liked_by = ?",[qna_id, user_id], (err, rows) =>{
            if(!err){

                if(rows.length == 0){
                  likes = parseInt(likes) + 1

                  connection.query(query,[likes, qna_id, qna_id, user_id], (err, rows) =>{
                    if(!err){
                    return res.send('like')
                    }else{
                      console.log(err)
                    }
                  })

                }else{

                  likes = parseInt(likes) - 1

                  connection.query(exist_query,[likes, qna_id, qna_id, user_id], (err, rows) =>{
                    if(!err){
                      return res.send('exist')
                    }else{
                      console.log(err)
                    }
                  })  
                }
            }else{
               console.log(err)
            }
        })

      }else{
        console.log(err)
      }

    })

  })  

  console.log(req.session.user)

}

exports.updateAnswer = (req, res)=>{

  var post_id = req.body.post_id
  var answer = req.body.answer
  var user_id = req.session.user.user.id

  pool.getConnection((err, connection) => {
      if (err) throw err; // not connected

      connection.query('UPDATE other_answer SET answer = ? WHERE answer_by = ? AND id = ?',[answer, user_id, post_id], (err, rows) => {
        if (!err) {
          return res.send('success');

      } else {
        console.log("errors---------------------------------------");  
        console.log(err);
        return res.send('error');
      }
        
      })
  });
  
}