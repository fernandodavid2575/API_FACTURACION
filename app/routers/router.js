const express = require('express');
const router = express.Router();

// Aquí es donde tus compañeros o tú agregarán las rutas más adelante
// Por ahora, dejamos una ruta de prueba
router.get('/api/test', (req, res) => {
    res.send({ message: "El router está funcionando correctamente" });
});

module.exports = router;