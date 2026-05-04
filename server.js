const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/config/db.config.js');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:4200', // Para tu Front-end en Angular
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Probar conexión a la base de datos
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  });

// Rutas
let router = require('./app/routers/router.js');
app.use('/', router);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido Estudiantes de UMG" });
});

// Iniciar servidor
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});