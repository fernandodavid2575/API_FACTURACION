const db = require('../config/db.config.js');

const crearCliente = async (req, res) => {
  const { dpi_cliente, nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente } = req.body;

  if (!dpi_cliente || !nombre_cliente || !apellido_cliente) {
    return res.status(400).json({ message: 'DPI, nombre y apellido son requeridos' });
  }

  try {
    const existe = await db.Cliente.findByPk(dpi_cliente);
    if (existe) {
      return res.status(409).json({ message: 'Ya existe un cliente con ese DPI' });
    }

    const cliente = await db.Cliente.create({
      dpi_cliente,
      nombre_cliente,
      apellido_cliente,
      correo_cliente,
      telefono_cliente
    });

    res.status(201).json({ message: 'Cliente creado exitosamente', cliente });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    res.status(500).json({ message: 'Error al crear cliente', error: error.message });
  }
};

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await db.Cliente.findAll({ order: [['apellido_cliente', 'ASC']] });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes', error: error.message });
  }
};

const obtenerClientePorDpi = async (req, res) => {
  const { dpi } = req.params;

  try {
    const cliente = await db.Cliente.findByPk(dpi);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cliente', error: error.message });
  }
};

const actualizarCliente = async (req, res) => {
  const { dpi } = req.params;
  const { nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente } = req.body;

  try {
    const cliente = await db.Cliente.findByPk(dpi);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await cliente.update({ nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente });
    res.json({ message: 'Cliente actualizado exitosamente', cliente });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo ya está registrado por otro cliente' });
    }
    res.status(500).json({ message: 'Error al actualizar cliente', error: error.message });
  }
};

const eliminarCliente = async (req, res) => {
  const { dpi } = req.params;

  try {
    const cliente = await db.Cliente.findByPk(dpi);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await cliente.destroy();
    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cliente', error: error.message });
  }
};

module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorDpi,
  actualizarCliente,
  eliminarCliente
};
