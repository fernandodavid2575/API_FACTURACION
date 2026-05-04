const express = require('express');
const router = express.Router();
// Asegúrate de que el nombre del archivo sea exactamente pagoController.js
const pagoController = require("../controllers/pagoController");

// Verificación de seguridad: Si esto imprime 'undefined', el archivo no se está cargando bien
console.log("Cargando controlador de pagos:", pagoController.registrarPago ? "OK" : "ERROR");

router.post("/pagos", pagoController.registrarPago);
router.get("/pagos", pagoController.obtenerPagos);
router.get("/pagos/factura/:id", pagoController.pagosPorFactura);

router.get('/test', (req, res) => {
    res.send({ message: "El router está funcionando correctamente" });
});

module.exports = router;