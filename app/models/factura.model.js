module.exports = (sequelize, Sequelize) => {
  return sequelize.define("factura", {
    id_factura: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    dpi_cliente_factura: { type: Sequelize.STRING(13) },
    dpi_usuario_factura: { type: Sequelize.STRING(13) },
    numero_factura: { type: Sequelize.STRING(30), unique: true, allowNull: false },
    fecha_emision_factura: { type: Sequelize.DATE },
    total_factura: { type: Sequelize.NUMERIC(14, 2) },
    estado_factura: { type: Sequelize.STRING(20) }
  }, { timestamps: false, freezeTableName: true });
};