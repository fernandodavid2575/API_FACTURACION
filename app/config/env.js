module.exports = {
  database: 'api_db',
  username: 'postgres',
  password: '1234',
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  jwt_secret: process.env.JWT_SECRET || 'api_facturacion_secret_key_2024',
  jwt_expiration: '24h'
};