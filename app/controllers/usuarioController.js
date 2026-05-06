const db = require('../config/db.config.js');
const bcrypt = require('bcryptjs');

const crearUsuario = async (req, res) => {
  const { dpi_usuario, nombre_usuario, apellido_usuario, correo_usuario, password_usuario, id_rol } = req.body;

  if (!dpi_usuario || !correo_usuario || !password_usuario || !id_rol) {
    return res.status(400).json({ message: 'DPI, correo, contraseña y rol son requeridos' });
  }

  try {
    const existe = await db.Usuario.findByPk(dpi_usuario);
    if (existe) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese DPI' });
    }

    const rol = await db.Rol.findByPk(id_rol);
    if (!rol) {
      return res.status(404).json({ message: 'El rol especificado no existe' });
    }

    const passwordHash = bcrypt.hashSync(password_usuario, 10);

    const usuario = await db.Usuario.create({
      dpi_usuario,
      nombre_usuario,
      apellido_usuario,
      correo_usuario,
      password_usuario: passwordHash,
      id_rol
    });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: {
        dpi_usuario: usuario.dpi_usuario,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        correo_usuario: usuario.correo_usuario,
        id_rol: usuario.id_rol
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await db.Usuario.findAll({
      attributes: { exclude: ['password_usuario'] },
      include: [{ model: db.Rol, as: 'rol', attributes: ['id_rol', 'nombre_rol'] }],
      order: [['apellido_usuario', 'ASC']]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

const obtenerUsuarioPorDpi = async (req, res) => {
  const { dpi } = req.params;

  try {
    const usuario = await db.Usuario.findByPk(dpi, {
      attributes: { exclude: ['password_usuario'] },
      include: [{ model: db.Rol, as: 'rol', attributes: ['id_rol', 'nombre_rol'] }]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

const actualizarUsuario = async (req, res) => {
  const { dpi } = req.params;
  const { nombre_usuario, apellido_usuario, correo_usuario, password_usuario, id_rol } = req.body;

  try {
    const usuario = await db.Usuario.findByPk(dpi);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (id_rol) {
      const rol = await db.Rol.findByPk(id_rol);
      if (!rol) {
        return res.status(404).json({ message: 'El rol especificado no existe' });
      }
    }

    const datosActualizar = { nombre_usuario, apellido_usuario, correo_usuario, id_rol };
    if (password_usuario) {
      datosActualizar.password_usuario = bcrypt.hashSync(password_usuario, 10);
    }

    await usuario.update(datosActualizar);

    res.json({
      message: 'Usuario actualizado exitosamente',
      usuario: {
        dpi_usuario: usuario.dpi_usuario,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        correo_usuario: usuario.correo_usuario,
        id_rol: usuario.id_rol
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo ya está registrado por otro usuario' });
    }
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

const eliminarUsuario = async (req, res) => {
  const { dpi } = req.params;

  try {
    const usuario = await db.Usuario.findByPk(dpi);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorDpi,
  actualizarUsuario,
  eliminarUsuario
};
