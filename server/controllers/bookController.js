const pool = require('../config/dbconfig')
var data = require('../data')

var richFunctions = require('../richardFunctions')
var userInfo = data.userInfo

exports.books = (req, res) => {
         
  if(req.session.user){
     userInfo.isLoged = req.session.user.isLoged
     userInfo.user = req.session.user.user
  }

  const locals = {
      title:"books Page",
      description:"New forums about"
  }

  res.render('courses/books',{userInfo:userInfo,locals});
}

exports.singleBook = (req, res) => {

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
    var query = "SELECT * FROM books WHERE status = 'active' ORDER BY views ASC LIMIT 5;"
    query += 'SELECT * FROM books WHERE id = ?;'
    query += 'SELECT cm.comment, cm.likes, cm.id AS comment_id,  us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.post_id = ? AND cm.type = ? ORDER BY cm.id DESC;'

    var dd_query = 'SELECT rp.dd_comment, rp.dd_likes, rp.id AS dd_id, us.username, us.avator, rp.dd_user_id AS comment_by FROM dd_comments AS rp INNER JOIN users AS us ON rp.dd_user_id = us.id WHERE rp.dd_comment_id = ? ORDER BY rp.id DESC;'

    connection.query(query, [post_id,post_id,'book'], (err, results, fields) => {

      if(err){
        console.log(err)
     }
      
      var book = results[1][0];
      var books = results[0];
      var replies = results[2];

      var rep_obj = []
      var len = replies.length

      //console.log('length is :'+len)

      ////seo datas
      var title = book.title
      var description = book.description
          description.substr(0, 200)
      var slug = book.slug
      
      var views = book.views
      views = parseInt(views) + 1

      if(len == 0){
        connection.query("UPDATE books SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
          if(!err){
             res.render('single/book', {userInfo: userInfo, rep_obj, books, book, style: "for_partials.css", title,description,slug });
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

          //console.log('let rep obj')
          //console.log(rep_obj)

          if(i == len - 1){
            connection.query("UPDATE books SET views = ? WHERE id = ?",[views,post_id],(err,rows)=>{
              if(!err){
                 res.render('single/book', {userInfo: userInfo, rep_obj, books, book, style: "for_partials.css", title,description,slug });
              }
           })
           
          } 
        })

        
      }
      //console.log('the data: \n',rows);
    })
  })
}
////constroller functions
exports.accountBook = (req, res)=>{
  if(req.session.user){
    userInfo.isLoged = req.session.user.isLoged
    userInfo.user = req.session.user.user
 }
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        //console.log('Connected!');
  
        connection.query('SELECT * FROM books ORDER BY id DESC', (err, rows) => {
          // Once done, release connection
          //connection.release();
  
          if (!err) {
            res.render('account/book',{userInfo:userInfo,books:rows,style:"account.css", title:"Book Dashbord Page"})
          } else {
            console.log(err);
            console.log("errors------------------------------------book");
          }
  
        });
      });
    
}

exports.getBookEdit = (req, res)=>{
    var id = req.body.id

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected!');
  
        connection.query('SELECT * FROM books WHERE id = '+id, (err, rows) => {
          // Once done, release connection
          //connection.release();
          if (!err) {
            return res.json(rows);
          } else {
            console.log("get book errors---------------------------------------");  
            console.log(err);
          }
  
        });
      });
    
}

exports.createBook = (req, res)=>{
    var { title, description, price, status, year, pages, author,} = req.body;
    var time = new Date()
    
    var filename = 'empty'
    var bookname = 'empty'

    var user_id = req.session.user.user.id;
    console.log(req.files)

    var file1 = req.files[0].filename
    var file2 = req.files[1].filename

    var nameArry = file1.split(".")
    var ext = nameArry[nameArry.length - 1]

    if(ext == 'pdf' || ext == 'PDF'){
      bookname = file1
      filename = file2
    }else{
      bookname = file2
      filename = file1
    }

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query('INSERT INTO books SET title = ?,size = ?, year = ?, pages = ?, author = ?, status = ? , description = ? , price = ?, thumbnail = ?, book_url = ?, created_by = ?',[title,'1.2', year, pages, author, status, description, price, filename, bookname, user_id], (err, rows) => {
        // Once done, release connection
        //connection.release();

        if (!err) {
          var id = rows.insertId
          var slug = richFunctions.getSlug(title,id,60)

          connection.query("UPDATE books SET slug = ? WHERE id = ?",[slug, id], (err,rows)=>{
              if(!err){
                res.redirect('/account/book');
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

exports.updateBook = (req, res)=>{
    var { title, description, price, status, year, pages, author, post_id} = req.body;

    console.log(req.body)
    
    var user_id = req.session.user.user.id;

    var slug = richFunctions.getSlug(title,post_id,60)

    console.log("book update");  

        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected!');
      
            connection.query('UPDATE books SET title = ?, slug = ?, size = ?, year = ?, pages = ?, author = ?, status = ? , description = ? , price = ?, created_by = ? WHERE id = ?',[title, slug,'1.2', year, pages, author, status, description, price, user_id, post_id], (err, rows) => {
              // Once done, release connection
              //connection.release();
      
              if (!err) {
                console.log("now is updated");  
                res.redirect('/account/book');
              } else {
                console.log("errors---------------------------------------");  
                console.log(err);
              }
      
            });
          });
 
}

////constroller functions

exports.deleteBook = (req, res)=>{

     var book_id = req.body.id;


      pool.getConnection((err, connection) => {
          if (err) throw err; // not connected
          console.log('Connected!');
    
          connection.query('DELETE FROM books  WHERE id = ?',[book_id], (err, rows) => {
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

