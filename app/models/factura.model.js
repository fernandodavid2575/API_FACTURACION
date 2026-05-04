module.exports = (sequelize, Sequelize) => {
  return sequelize.define("factura", {
    id_factura: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    dpi_cliente_factura: { type: Sequelize.STRING(13) },
    dpi_usuario_factura: { type: Sequelize.STRING(13) },
    numero_factura: { type: Sequelize.STRING(30), unique: true, allowNull: false },
    fecha_emision_factura: { type: Sequelize.DATE },
    fecha_vencimiento_factura: { type: Sequelize.DATEONLY },
    estado_factura: { type: Sequelize.STRING(20) },
    subtotal_factura: { type: Sequelize.NUMERIC(14, 2) },
    total_factura: { type: Sequelize.NUMERIC(14, 2) },
    moneda_factura: { type: Sequelize.STRING(3), defaultValue: 'GTQ' },
    fecha_creacion_factura: { type: Sequelize.DATEONLY },
    fecha_actualizacion_factura: { type: Sequelize.DATEONLY }
  }, { timestamps: false, freezeTableName: true });
};