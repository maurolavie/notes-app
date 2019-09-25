const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport'); // Lo requiere aqui porque esta utilizando una estrategia de autenticacion

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes', // Si dio todo correcto usuario y password etc
    failureRedirect: '/users/signin', // Si se logueo mal y le erro 
    failureFlash: true // Para que pueda mandar los mensajes si ocurren estos fallos
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <= 0) {
        errors.push({text: 'Please Insert your Name'});
    }
    if(password != confirm_password) {
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if(errors.length > 0 ) {
        res.render('users/signup', {errors, name, email, password, confirm_password});
    } else {
        //res.send('ok') // utiliza para ir haciendo pruebas luego el codigo de abajo para persistir a la bd
        const emailUser = await User.findOne({email: email});
        if(emailUser) {
            req.flash('error_msg', 'The Email is already in use');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;