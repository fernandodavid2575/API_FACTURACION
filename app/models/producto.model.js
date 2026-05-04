module.exports = (sequelize, Sequelize) => {
  return sequelize.define("producto", {
    id_producto: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    codigo_producto: { type: Sequelize.STRING, unique: true, allowNull: false },
    id_categoria_producto: { type: Sequelize.INTEGER },
    nombre_producto: { type: Sequelize.STRING },
    precio_unitario_producto: { type: Sequelize.NUMERIC(12, 2) },
    stock_actual_producto: { type: Sequelize.INTEGER }
  }, { timestamps: false, freezeTableName: true });
};