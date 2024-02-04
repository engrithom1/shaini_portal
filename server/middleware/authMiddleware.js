// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    //console.log("from session checker ")
    //console.log(req.session.user)
    if (req.session.user.isLoged) {
		
        res.redirect('/');
    } else {
        next();
    }    
};

var authChecker = (req, res, next) => {
    //console.log("from authchecker ")
    //console.log(req.session.user)
    if (!req.session.user.isLoged) {
        res.redirect('/login');
    } else {
        next();
    }    
};

var authSuperChecker = (req, res, next) => {
    //console.log("from super authchecker ")
    //console.log(req.session.user)
    if (req.session.user.user.role >= 1) {
        next();
    } else {
        res.redirect('/');
    }    
};

module.exports = {sessionChecker, authChecker, authSuperChecker}