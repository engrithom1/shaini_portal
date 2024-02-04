const pool = require('../config/dbconfig')
var data = require('../data')

var userInfo = data.userInfo
//home page
exports.viewCourseData = (req, res) => {

    var post_id = req.body.course_id
    var post_type = req.body.course_type

    if(req.session.user){
       userInfo.isLoged = req.session.user.isLoged
       userInfo.user = req.session.user.user
    }
    var query = "SELECT cm.comment, cm.likes, cm.id AS comment_id, us.username, us.avator, cm.user_id AS comment_by FROM comments AS cm INNER JOIN users AS us ON cm.user_id = us.id WHERE cm.type = ? AND cm.post_id = ? ORDER BY cm.id DESC;"
        query += "SELECT COUNT(id) FROM payed WHERE post_type = ? AND post_id = ?;"
        query += "SELECT SUM(amount) AS Total_p FROM payed WHERE post_type = ? AND post_id = ?;"
        query += "SELECT COUNT(id) FROM course_impressions WHERE post_type = ? AND post_id = ?;"
       
    //connect to DB SELECT SUM(Quantity) AS TotalItemsOrdered FROM OrderDetails;
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        // select videos
        connection.query(query,[post_type,post_id,post_type,post_id,post_type,post_id,post_type,post_id],(err, results) => {
            if(!err){
               
                var comments = results[0]
                var selles = results[1][0]['COUNT(id)']
                var total_p = results[2][0]['Total_p'] + 0
                var impression = results[3][0]['COUNT(id)']

                //console.log(total_p)
                
               return res.render('partials/course_data',{layout:false, comments, selles, total_p, impression})
               
            }else{ console.log(err)}
        })

       
    })
}
