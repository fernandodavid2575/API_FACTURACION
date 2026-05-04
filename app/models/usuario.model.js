module.exports = (sequelize, Sequelize) => {
  return sequelize.define("usuario", {
    dpi_usuario: { type: Sequelize.STRING(13), primaryKey: true },
    nombre_usuario: { type: Sequelize.STRING(50) },
    apellido_usuario: { type: Sequelize.STRING(100) },
    correo_usuario: { type: Sequelize.STRING(150), unique: true },
    password_usuario: { type: Sequelize.STRING(100), allowNull: false },
    id_rol: { type: Sequelize.INTEGER, allowNull: false }
  }, { timestamps: false, freezeTableName: true });
};