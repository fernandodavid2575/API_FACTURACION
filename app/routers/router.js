const express = require('express');
const router = express.Router();
// Asegúrate de que el nombre del archivo sea exactamente pagoController.js
const pagoController = require("../controllers/pagoController");
const facturaController = require("../controllers/facturaController");

// Verificación de seguridad: Si esto imprime 'undefined', el archivo no se está cargando bien
console.log("Cargando controlador de pagos:", pagoController.registrarPago ? "OK" : "ERROR");
console.log("Cargando controlador de facturas:", facturaController.crearFactura ? "OK" : "ERROR");

// --- Rutas de Pagos (Dev 4) ---
router.post("/pagos", pagoController.registrarPago);
router.get("/pagos", pagoController.obtenerPagos);
router.get("/pagos/factura/:id", pagoController.pagosPorFactura);

// --- Rutas de Facturación (Dev 3) ---
router.post("/facturas", facturaController.crearFactura);
router.get("/facturas", facturaController.obtenerFacturas);
router.get("/facturas/:id", facturaController.obtenerFacturaPorId);
router.get("/facturas/cliente/:dpi", facturaController.obtenerFacturasPorCliente);
router.put("/facturas/anular/:id", facturaController.anularFactura);
router.put("/facturas/estado/:id", facturaController.cambiarEstado);

router.get('/test', (req, res) => {
    res.send({ message: "El router está funcionando correctamente" });
});

module.exports = router;