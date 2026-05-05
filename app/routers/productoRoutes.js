const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/producto.controller.js');

// GET    /api/productos
router.get('/', ctrl.getAll);

// GET    /api/productos/stock-bajo  ← antes que /:id para que no haya conflicto
router.get('/stock-bajo', ctrl.getStockBajo);

// GET    /api/productos/:id
router.get('/:id', ctrl.getById);

// POST   /api/productos
router.post('/', ctrl.create);

// PUT    /api/productos/:id
router.put('/:id', ctrl.update);

// DELETE /api/productos/:id
router.delete('/:id', ctrl.remove);

// PATCH  /api/productos/:codigo/actualizar-stock  (usado por DEV3)
router.patch('/:codigo/actualizar-stock', ctrl.actualizarStock);

module.exports = router;