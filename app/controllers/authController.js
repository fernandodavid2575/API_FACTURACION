const db = require('../config/db.config.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env.js');

const login = async (req, res) => {
  const { correo_usuario, password_usuario } = req.body;

  if (!correo_usuario || !password_usuario) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  try {
    const usuario = await db.Usuario.findOne({
      where: { correo_usuario },
      include: [{ model: db.Rol, as: 'rol' }]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordValido = bcrypt.compareSync(password_usuario, usuario.password_usuario);
    if (!passwordValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        dpi_usuario: usuario.dpi_usuario,
        correo_usuario: usuario.correo_usuario,
        id_rol: usuario.id_rol,
        nombre_rol: usuario.rol ? usuario.rol.nombre_rol : null
      },
      env.jwt_secret,
      { expiresIn: env.jwt_expiration }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        dpi_usuario: usuario.dpi_usuario,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        correo_usuario: usuario.correo_usuario,
        rol: usuario.rol ? usuario.rol.nombre_rol : null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { login };
