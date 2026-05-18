require('dotenv').config();

module.exports = {
  database: process.env.DB_NAME || 'api_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
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