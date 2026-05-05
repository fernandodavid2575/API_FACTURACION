const db = require('../config/db.js');
const { Op } = require('sequelize');
const Producto  = db.Producto;
const Categoria = db.Categoria;

const STOCK_MINIMO_GLOBAL = 5;
const hoy = () => new Date().toISOString().split('T')[0];

// Helper: alerta si el stock está en o bajo el mínimo
const alertaStock = (producto) => {
  const limite = producto.stock_minimo_producto ?? STOCK_MINIMO_GLOBAL;
  if (producto.stock_actual_producto <= limite) {
    return {
      alerta_stock: true,
      mensaje_alerta: `⚠️ Stock bajo: "${producto.nombre_producto}" tiene ${producto.stock_actual_producto} unidades (mínimo: ${limite})`,
    };
  }
  return { alerta_stock: false };
};

// ──────────────────────────────────────────────
// GET /api/productos
// ──────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id_categoria_producto', 'nombre_categoria_producto'],
      }],
      order: [['nombre_producto', 'ASC']],
    });

    const resultado = productos.map((p) => ({
      ...p.toJSON(),
      ...alertaStock(p),
    }));

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// GET /api/productos/stock-bajo
// ──────────────────────────────────────────────
exports.getStockBajo = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: db.sequelize.where(
        db.sequelize.col('stock_actual_producto'),
        { [Op.lte]: db.sequelize.col('stock_minimo_producto') }
      ),
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id_categoria_producto', 'nombre_categoria_producto'],
      }],
    });

    return res.status(200).json({ total: productos.length, productos });
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// GET /api/productos/:id
// ──────────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id_categoria_producto', 'nombre_categoria_producto'],
      }],
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.status(200).json({ ...producto.toJSON(), ...alertaStock(producto) });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// POST /api/productos
// ──────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const {
      codigo_producto,
      id_categoria_producto,
      nombre_producto,
      descripcion_producto,
      precio_unitario_producto,
      precio_costo_producto,
      stock_actual_producto,
      stock_minimo_producto,
    } = req.body;

    if (!codigo_producto || !precio_unitario_producto) {
      return res.status(400).json({ mensaje: 'codigo_producto y precio_unitario_producto son requeridos' });
    }

    if (id_categoria_producto) {
      const categoria = await Categoria.findByPk(id_categoria_producto);
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
    }

    const nuevo = await Producto.create({
      codigo_producto,
      id_categoria_producto,
      nombre_producto,
      descripcion_producto,
      precio_unitario_producto,
      precio_costo_producto,
      stock_actual_producto: stock_actual_producto ?? 0,
      stock_minimo_producto: stock_minimo_producto ?? STOCK_MINIMO_GLOBAL,
      fecha_creacion_producto: hoy(),
      fecha_actualizacion_producto: hoy(),
    });

    return res.status(201).json({
      mensaje: 'Producto creado correctamente',
      producto: nuevo,
      ...alertaStock(nuevo),
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
    }
    console.error('Error al crear producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// PUT /api/productos/:id
// ──────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo_producto,
      id_categoria_producto,
      nombre_producto,
      descripcion_producto,
      precio_unitario_producto,
      precio_costo_producto,
      stock_actual_producto,
      stock_minimo_producto,
    } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (id_categoria_producto) {
      const categoria = await Categoria.findByPk(id_categoria_producto);
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
    }

    await producto.update({
      codigo_producto,
      id_categoria_producto,
      nombre_producto,
      descripcion_producto,
      precio_unitario_producto,
      precio_costo_producto,
      stock_actual_producto,
      stock_minimo_producto,
      fecha_actualizacion_producto: hoy(),
    });

    return res.status(200).json({
      mensaje: 'Producto actualizado correctamente',
      producto,
      ...alertaStock(producto),
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'Ya existe un producto con ese código' });
    }
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// DELETE /api/productos/:id
// ──────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.destroy();
    return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ mensaje: 'No se puede eliminar: está referenciado en detalles de factura' });
    }
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// PATCH /api/productos/:codigo/actualizar-stock
// Usado por DEV3 al crear detalle de factura
// body: { cantidad: N }
// ──────────────────────────────────────────────
exports.actualizarStock = async (req, res) => {
  try {
    const { codigo } = req.params;   // usa codigo_producto (FK en detalle_factura)
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser un número positivo' });
    }

    const producto = await Producto.findOne({ where: { codigo_producto: codigo } });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (producto.stock_actual_producto < cantidad) {
      return res.status(400).json({
        mensaje: `Stock insuficiente. Disponible: ${producto.stock_actual_producto}, solicitado: ${cantidad}`,
      });
    }

    const nuevoStock = producto.stock_actual_producto - cantidad;
    await producto.update({
      stock_actual_producto: nuevoStock,
      fecha_actualizacion_producto: hoy(),
    });

    const info = alertaStock({ ...producto.toJSON(), stock_actual_producto: nuevoStock });

    return res.status(200).json({
      mensaje: 'Stock actualizado correctamente',
      codigo_producto: codigo,
      stock_anterior: producto.stock_actual_producto,
      stock_actual: nuevoStock,
      ...info,
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};