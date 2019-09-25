//const router = require('express').Router(); // este metodo Router me da un objeto que me facilita la creacion de rutas
// se puede hacer lo anterior separandolo en dos constantes
const express = require('express');
const router = express.Router();

// aca puedo crear rutas

// Estas rutas luego se reemplazan con vistas de verdad ahora son texto solo
//router.get('/', (req, res) => { 
//    res.send('Index');
//});

//router.get('/about', (req, res) => {
//    res.send('About');
//});

// Ahora las reemplazo por los archivos
router.get('/', (req, res) => { 
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});


module.exports = router;