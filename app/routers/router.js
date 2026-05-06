const express = require('express');
const router = express.Router();

const pagoController = require('../controllers/pagoController');
const facturaController = require('../controllers/facturaController');
const authController = require('../controllers/authController');
const clienteController = require('../controllers/clienteController');
const usuarioController = require('../controllers/usuarioController');
const rolController = require('../controllers/rolController');

const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin, hasRole } = require('../middlewares/roles.middleware');

// --- Autenticación (pública) ---
router.post('/auth/login', authController.login);

// --- Roles (solo ADMIN) ---
router.post('/roles', verifyToken, isAdmin, rolController.crearRol);
router.get('/roles', verifyToken, rolController.obtenerRoles);
router.get('/roles/:id', verifyToken, rolController.obtenerRolPorId);
router.put('/roles/:id', verifyToken, isAdmin, rolController.actualizarRol);
router.delete('/roles/:id', verifyToken, isAdmin, rolController.eliminarRol);

// --- Usuarios (solo ADMIN) ---
router.post('/usuarios', verifyToken, isAdmin, usuarioController.crearUsuario);
router.get('/usuarios', verifyToken, isAdmin, usuarioController.obtenerUsuarios);
router.get('/usuarios/:dpi', verifyToken, isAdmin, usuarioController.obtenerUsuarioPorDpi);
router.put('/usuarios/:dpi', verifyToken, isAdmin, usuarioController.actualizarUsuario);
router.delete('/usuarios/:dpi', verifyToken, isAdmin, usuarioController.eliminarUsuario);

// --- Clientes (autenticado: ADMIN o USER) ---
router.post('/clientes', verifyToken, hasRole('ADMIN', 'USER'), clienteController.crearCliente);
router.get('/clientes', verifyToken, clienteController.obtenerClientes);
router.get('/clientes/:dpi', verifyToken, clienteController.obtenerClientePorDpi);
router.put('/clientes/:dpi', verifyToken, hasRole('ADMIN', 'USER'), clienteController.actualizarCliente);
router.delete('/clientes/:dpi', verifyToken, isAdmin, clienteController.eliminarCliente);

// --- Rutas de Pagos ---
router.post('/pagos', verifyToken, pagoController.registrarPago);
router.get('/pagos', verifyToken, pagoController.obtenerPagos);
router.get('/pagos/factura/:id', verifyToken, pagoController.pagosPorFactura);

// --- Rutas de Facturación ---
router.post('/facturas', verifyToken, facturaController.crearFactura);
router.get('/facturas', verifyToken, facturaController.obtenerFacturas);
router.get('/facturas/:id', verifyToken, facturaController.obtenerFacturaPorId);
router.get('/facturas/cliente/:dpi', verifyToken, facturaController.obtenerFacturasPorCliente);
router.put('/facturas/anular/:id', verifyToken, facturaController.anularFactura);
router.put('/facturas/estado/:id', verifyToken, facturaController.cambiarEstado);

router.get('/test', (req, res) => {
  res.json({ message: 'El router está funcionando correctamente' });
});

module.exports = router;
