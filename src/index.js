const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash'); // con este modulo e pueden mandar mnsjs entre multiples vistas - como mostrar un mnsj al usuario al agregar un dato, etc
const passport = require('passport');

// Initializations
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views')); // dirname me retorna la carpeta src y luego lo concatena con la carpeta views
app.engine('.hbs', exphbs({ // estas propiedades sirven para saber de que manera vamos a utilizar las vistas
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), // concatena estas dos views y layouts
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs' // aca se coloca la extencion de todos los archivos
}));
app.set('view engine', '.hbs'); // Para poder utilizarlo al setting - para configurar el motor de plantilla

// Middlewares
app.use(express.urlencoded({extended: false})); // configuro esta linea de codigo para recibir los datos por ejemplo usuario y email
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // Esta ultima para el poder ver los msns de error en la pagina signin de inicio de sesion
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use(require('./routes/index')); // Le hago saber a mi servidor que aqui estan mis rutas en el servidor
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listenning
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});