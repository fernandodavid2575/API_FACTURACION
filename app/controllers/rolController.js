const db = require('../config/db.config.js');

const crearRol = async (req, res) => {
  const { nombre_rol } = req.body;

  if (!nombre_rol) {
    return res.status(400).json({ message: 'El nombre del rol es requerido' });
  }

  try {
    const rol = await db.Rol.create({ nombre_rol: nombre_rol.toUpperCase() });
    res.status(201).json({ message: 'Rol creado exitosamente', rol });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe un rol con ese nombre' });
    }
    res.status(500).json({ message: 'Error al crear rol', error: error.message });
  }
};

const obtenerRoles = async (req, res) => {
  try {
    const roles = await db.Rol.findAll({ order: [['nombre_rol', 'ASC']] });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error: error.message });
  }
};

const obtenerRolPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const rol = await db.Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rol', error: error.message });
  }
};

const actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { nombre_rol } = req.body;

  if (!nombre_rol) {
    return res.status(400).json({ message: 'El nombre del rol es requerido' });
  }

  try {
    const rol = await db.Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    await rol.update({ nombre_rol: nombre_rol.toUpperCase() });
    res.json({ message: 'Rol actualizado exitosamente', rol });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe un rol con ese nombre' });
    }
    res.status(500).json({ message: 'Error al actualizar rol', error: error.message });
  }
};

const eliminarRol = async (req, res) => {
  const { id } = req.params;

  try {
    const rol = await db.Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    const usuariosConRol = await db.Usuario.count({ where: { id_rol: id } });
    if (usuariosConRol > 0) {
      return res.status(409).json({
        message: `No se puede eliminar el rol. Tiene ${usuariosConRol} usuario(s) asignado(s)`
      });
    }

    await rol.destroy();
    res.json({ message: 'Rol eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar rol', error: error.message });
  }
};

module.exports = {
  crearRol,
  obtenerRoles,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol
};
