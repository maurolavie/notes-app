const helpers = {};

// Esto es un midleware, una funcion que se ejecuta dependiendo de lo que se le pasa . Aqui revisa si el usuario esta autenticado o no
helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/signin');
};

module.exports = helpers;