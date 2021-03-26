const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

//Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Router
const productosRoutes = require('./routers/productos');
const usuariosRoutes = require('./routers/usuarios');
const pedidosRoutes = require('./routers/pedidos');
const categoriasRoutes = require('./routers/categorias');

const api = process.env.API_URL;

app.use(`${api}/productos`, productosRoutes);
app.use(`${api}/usuarios`, usuariosRoutes);
app.use(`${api}/pedidos`, pedidosRoutes);
app.use(`${api}/categorias`, categoriasRoutes);

//Base de Datos
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Base de datos conectada');
    })
    .catch((err) => {
        console.log(err);
    })

//Desarrollo
//app.listen(3000);

//Produccion
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port;
    console.log("Express esta funcionando en el puerto " + port);
})