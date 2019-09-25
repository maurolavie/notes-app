const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth'); // Se lo agrega a cada ruta porque para eso sirve usar el ver si esta o no autenticado el usuario

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note',isAuthenticated, async (req, res) => { // con async cuando guarde en la bd lo hace de manera asincronica 
    const{ title, description } = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: 'Please Write a Title'});
    }
    if (!description) {
        errors.push({text: 'Please Write a Description'});
    }
    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        //console.log(newNote); // Con esta linea pude ver en consola que se creo el objeto correctamente y mongo hizo un id y un date con fecha del dia automaticamente
        await newNote.save(); // con esta linea el objeto se guarda en la bd mongodb y con await va a esperar a que termine de guardar en la bd asi no hace lio
        req.flash('success_msg', 'Note Added Successfully');
        //res.send('ok') // mientras se hizo pruebas mandaba un ok en el navegador .. abajo cambio por una vista
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated, async (req,res) =>{
    //res.send('Notes from database');// mientras hacia pruebas dirigia esto en el navegador ahora abajo traera el verdadero valor insertado en la base de datos mongo
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}); // Aca me trae las notas pero del usuario logueado solamente
    res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-notes', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description});
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;