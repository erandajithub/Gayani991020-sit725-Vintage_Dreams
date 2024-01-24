
const handleLogout = async (req, res) => {
    // clear session
    req.session.destroy();
    res.redirect('/login');
}

module.exports = { handleLogout }