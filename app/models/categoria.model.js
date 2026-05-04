module.exports = (sequelize, Sequelize) => {
  return sequelize.define("categoria_producto", {
    id_categoria_producto: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_categoria_producto: { type: Sequelize.STRING, unique: true },
    descripcion_categoria_producto: { type: Sequelize.STRING },
    fecha_creacion_categoria_producto: { type: Sequelize.DATE },
    fecha_actualizacion_categoria_producto: { type: Sequelize.DATE }
  }, { timestamps: false, freezeTableName: true });
};