module.exports = (sequelize, Sequelize) => {
  return sequelize.define("cliente", {
    dpi_cliente: { type: Sequelize.STRING(13), primaryKey: true },
    nombre_cliente: { type: Sequelize.STRING },
    apellido_cliente: { type: Sequelize.STRING },
    correo_cliente: { type: Sequelize.STRING, unique: true },
    telefono_cliente: { type: Sequelize.STRING }
  }, { timestamps: false, freezeTableName: true });
};