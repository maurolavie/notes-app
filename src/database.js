const mongoose = require('mongoose');

// Si la base de datos no existe la crea por nosotros.. si existe la utiliza..
mongoose.connect('mongodb+srv://dbMauro:jGGfeZGCToIZHVhh@cluster0-svc2o.mongodb.net/test?retryWrites=true&w=majority', { // aca un objeto de configuracion por si da unos errores por consola
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('DB is connected')) // mensaje por consola para cuando se conecta
    .catch(err => console.error(err)); // mensaje por consola si ocurre un error