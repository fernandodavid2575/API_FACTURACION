module.exports = (sequelize, Sequelize) => {
  return sequelize.define("pago", {
    id_pago: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    id_factura_pago: { type: Sequelize.INTEGER },
    fecha_pago: { type: Sequelize.DATE },
    monto_pago: { type: Sequelize.NUMERIC(14, 2) },
    metodo_pago: { type: Sequelize.STRING(15) }
  }, { timestamps: false, freezeTableName: true });
};