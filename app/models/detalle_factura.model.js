module.exports = (sequelize, Sequelize) => {
  return sequelize.define("detalle_factura", {
    id_detalle_factura: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    id_factura_detalle_factura: { type: Sequelize.INTEGER, allowNull: false },
    codigo_producto_detalle_factura: { type: Sequelize.STRING(50), allowNull: false },
    cantidad_detalle_factura: { type: Sequelize.INTEGER, allowNull: false },
    precio_unitario_detalle_factura: { type: Sequelize.NUMERIC(12, 2), allowNull: false }
  }, { timestamps: false, freezeTableName: true });
};
