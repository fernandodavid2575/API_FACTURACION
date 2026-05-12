const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db.config.js'); // Quité el /app/ porque ya estás dentro
const router = require("./routers/router.js"); // Quité el /app/ porque ya estás dentro
const errorHandler = require("./middlewares/errorHandler");


const app = express();

// --- Configuración de Middlewares ---
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// --- Conexión a la Base de Datos ---
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });


app.use('/api', router);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido Estudiantes de UMG" });
});

// --- Manejo de Errores ---
app.use(errorHandler);

module.exports = app;
