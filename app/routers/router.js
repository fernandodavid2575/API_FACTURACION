const express = require('express');
const router = express.Router();

// --- Controllers ---
const authController      = require('../controllers/authController');
const rolController       = require('../controllers/rolController');
const usuarioController   = require('../controllers/usuarioController');
const clienteController   = require('../controllers/clienteController');
const facturaController   = require('../controllers/facturaController');
const pagoController      = require('../controllers/pagoController');
const categoriaController = require('../controllers/categoriaController');
const productoController  = require('../controllers/productoControllers');

// --- Middlewares ---
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin, hasRole } = require('../middlewares/roles.middleware');

// ============================================================
// AUTENTICACIÓN (pública)
// ============================================================
router.post('/auth/login', authController.login);

// ============================================================
// ROLES (solo ADMIN para escritura)
// ============================================================
router.post('/roles',       verifyToken, isAdmin, rolController.crearRol);
router.get('/roles',        verifyToken, rolController.obtenerRoles);
router.get('/roles/:id',    verifyToken, rolController.obtenerRolPorId);
router.put('/roles/:id',    verifyToken, isAdmin, rolController.actualizarRol);
router.delete('/roles/:id', verifyToken, isAdmin, rolController.eliminarRol);

// ============================================================
// USUARIOS (solo ADMIN)
// ============================================================
router.post('/usuarios',         verifyToken, isAdmin, usuarioController.crearUsuario);
router.get('/usuarios',          verifyToken, isAdmin, usuarioController.obtenerUsuarios);
router.get('/usuarios/:dpi',     verifyToken, isAdmin, usuarioController.obtenerUsuarioPorDpi);
router.put('/usuarios/:dpi',     verifyToken, isAdmin, usuarioController.actualizarUsuario);
router.delete('/usuarios/:dpi',  verifyToken, isAdmin, usuarioController.eliminarUsuario);

// ============================================================
// CLIENTES (ADMIN o USER autenticado)
// ============================================================
router.post('/clientes',         verifyToken, hasRole('ADMIN', 'USER'), clienteController.crearCliente);
router.get('/clientes',          verifyToken, clienteController.obtenerClientes);
router.get('/clientes/:dpi',     verifyToken, clienteController.obtenerClientePorDpi);
router.put('/clientes/:dpi',     verifyToken, hasRole('ADMIN', 'USER'), clienteController.actualizarCliente);
router.delete('/clientes/:dpi',  verifyToken, isAdmin, clienteController.eliminarCliente);

// ============================================================
// CATEGORÍAS  (montar en app.js con: app.use('/api/categorias', router) NO,
// aquí van con prefijo completo para unificarlo todo bajo un solo router)
// ============================================================
router.get('/categorias',         verifyToken, categoriaController.getAll);
router.get('/categorias/:id',     verifyToken, categoriaController.getById);
router.post('/categorias',        verifyToken, hasRole('ADMIN', 'USER'), categoriaController.create);
router.put('/categorias/:id',     verifyToken, hasRole('ADMIN', 'USER'), categoriaController.update);
router.delete('/categorias/:id',  verifyToken, isAdmin, categoriaController.remove);

// ============================================================
// PRODUCTOS
// Nota: /stock-bajo va ANTES que /:id para evitar conflicto de rutas
// ============================================================
router.get('/productos',                              verifyToken, productoController.getAll);
router.get('/productos/stock-bajo',                   verifyToken, productoController.getStockBajo);
router.get('/productos/:id',                          verifyToken, productoController.getById);
router.post('/productos',                             verifyToken, hasRole('ADMIN', 'USER'), productoController.create);
router.put('/productos/:id',                          verifyToken, hasRole('ADMIN', 'USER'), productoController.update);
router.delete('/productos/:id',                       verifyToken, isAdmin, productoController.remove);
router.patch('/productos/:codigo/actualizar-stock',   verifyToken, hasRole('ADMIN', 'USER'), productoController.actualizarStock);

// ============================================================
// FACTURAS
// ============================================================
router.post('/facturas',                  verifyToken, hasRole('ADMIN', 'USER'), facturaController.crearFactura);
router.get('/facturas',                   verifyToken, facturaController.obtenerFacturas);
router.get('/facturas/:id',               verifyToken, facturaController.obtenerFacturaPorId);
router.get('/facturas/cliente/:dpi',      verifyToken, facturaController.obtenerFacturasPorCliente);
router.put('/facturas/anular/:id',        verifyToken, isAdmin, facturaController.anularFactura);
router.put('/facturas/estado/:id',        verifyToken, hasRole('ADMIN', 'USER'), facturaController.cambiarEstado);

// ============================================================
// PAGOS
// ============================================================
router.post('/pagos',               verifyToken, hasRole('ADMIN', 'USER'), pagoController.registrarPago);
router.get('/pagos',                verifyToken, pagoController.obtenerPagos);
router.get('/pagos/factura/:id',    verifyToken, pagoController.pagosPorFactura);

// ============================================================
// TEST
// ============================================================
router.get('/test', (req, res) => {
  res.json({ message: 'El router está funcionando correctamente' });
});

module.exports = router;
