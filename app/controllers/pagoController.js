// Cambiamos la ruta para que coincida exactamente con tu archivo: db.config.js
const db = require("../config/db.config.js"); 

const registrarPago = async (req, res) => {
  const {
    id_factura_pago,
    monto_pago,
    metodo_pago,
    numero_referencia_pago
  } = req.body;

  try {
    // Si usas Sequelize, la forma de hacer queries manuales es db.sequelize.query
    // Si usas 'pg' directamente, asegúrate de que db.query sea válido.
    // Asumiendo que usas el objeto 'db' que configuramos antes:

    const factura = await db.sequelize.query(
      "SELECT * FROM factura WHERE id_factura = :id",
      { replacements: { id: id_factura_pago }, type: db.sequelize.QueryTypes.SELECT }
    );

    if (factura.length === 0) {
      return res.status(404).json({ message: "Factura no existe" });
    }

    await db.sequelize.query(
      `INSERT INTO pago 
      (id_factura_pago, fecha_pago, monto_pago, metodo_pago, numero_referencia_pago, estado_pago, fecha_creacion_pago)
      VALUES (:id, NOW(), :monto, :metodo, :ref, 'COMPLETADO', CURRENT_DATE)`,
      { replacements: { 
          id: id_factura_pago, 
          monto: monto_pago, 
          metodo: metodo_pago, 
          ref: numero_referencia_pago 
      }}
    );

    res.json({ message: "Pago registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const obtenerPagos = async (req, res) => {
  try {
    const pagos = await db.sequelize.query("SELECT * FROM pago", { type: db.sequelize.QueryTypes.SELECT });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const pagosPorFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const pagos = await db.sequelize.query(
      "SELECT * FROM pago WHERE id_factura_pago = :id",
      { replacements: { id }, type: db.sequelize.QueryTypes.SELECT }
    );
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Asegúrate de que los nombres aquí coincidan con el router
module.exports = {
  registrarPago,
  obtenerPagos,
  pagosPorFactura
};