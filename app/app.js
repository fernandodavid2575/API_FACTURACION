const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db.config.js');
const router = require("./routers/router.js");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

db.sequelize.authenticate()
  .then(() => {
    console.log('Conexion a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err.message);
  });

app.use('/api', router);

app.get("/", (req, res) => {
  res.json({ 
    message: "Bienvenido Estudiantes de UMG",
    server: process.env.SERVER_NAME || 'api-node',
    hostname: require('os').hostname()
  });
});

app.use(errorHandler);

module.exports = app;