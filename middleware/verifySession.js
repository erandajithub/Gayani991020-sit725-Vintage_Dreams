const verifySession = (req, res, next) => {
    if (req.cookies.user_sid && req.session.email) {
        next();
    }
    else {
        res.redirect('/login');
    }
};

module.exports = verifySession