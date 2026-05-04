module.exports = (sequelize, Sequelize) => {
  return sequelize.define("rol", {
    id_rol: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_rol: { type: Sequelize.STRING(80), allowNull: false, unique: true }
  }, { timestamps: false, freezeTableName: true });
};