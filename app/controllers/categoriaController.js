const db = require('../config/db.js');
const Categoria = db.Categoria;

const hoy = () => new Date().toISOString().split('T')[0];

// ──────────────────────────────────────────────
// GET /api/categorias
// ──────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nombre_categoria_producto', 'ASC']],
    });
    return res.status(200).json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// GET /api/categorias/:id
// ──────────────────────────────────────────────
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// POST /api/categorias
// ──────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const { nombre_categoria_producto, descripcion_categoria_producto } = req.body;

    if (!nombre_categoria_producto) {
      return res.status(400).json({ mensaje: 'El nombre de la categoría es requerido' });
    }

    const nueva = await Categoria.create({
      nombre_categoria_producto,
      descripcion_categoria_producto,
      fecha_creacion_categoria_producto: hoy(),
      fecha_actualizacion_categoria_producto: hoy(),
    });

    return res.status(201).json({ mensaje: 'Categoría creada correctamente', categoria: nueva });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error al crear categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// PUT /api/categorias/:id
// ──────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_categoria_producto, descripcion_categoria_producto } = req.body;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    await categoria.update({
      nombre_categoria_producto,
      descripcion_categoria_producto,
      fecha_actualizacion_categoria_producto: hoy(),
    });

    return res.status(200).json({ mensaje: 'Categoría actualizada correctamente', categoria });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre' });
    }
    console.error('Error al actualizar categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};

// ──────────────────────────────────────────────
// DELETE /api/categorias/:id
// (borrado físico — la tabla no tiene columna activo)
// ──────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    await categoria.destroy();
    return res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ mensaje: 'No se puede eliminar: tiene productos asociados' });
    }
    console.error('Error al eliminar categoría:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};