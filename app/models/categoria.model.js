module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id_categoria_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_categoria_producto: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion_categoria_producto: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    fecha_creacion_categoria_producto: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fecha_actualizacion_categoria_producto: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    tableName: 'categoria_producto',
    timestamps: false, // manejamos fechas manualmente con los campos del SQL
  });

  Categoria.associate = (db) => {
    Categoria.hasMany(db.Producto, {
      foreignKey: 'id_categoria_producto',
      as: 'productos',
    });
  };

  return Categoria;
};