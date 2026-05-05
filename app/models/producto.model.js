module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo_producto: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    id_categoria_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nombre_producto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    descripcion_producto: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    precio_unitario_producto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    precio_costo_producto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    stock_actual_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    stock_minimo_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5,  // valor global por defecto
    },
    fecha_creacion_producto: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fecha_actualizacion_producto: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  }, {
    tableName: 'producto',
    timestamps: false, // manejamos fechas manualmente
  });

  Producto.associate = (db) => {
    Producto.belongsTo(db.Categoria, {
      foreignKey: 'id_categoria_producto',
      as: 'categoria',
    });
  };

  return Producto;
};