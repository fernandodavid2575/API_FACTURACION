module.exports = {
  database: 'API_DB',
  username: 'postgres',
  password: 'umg123',
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};