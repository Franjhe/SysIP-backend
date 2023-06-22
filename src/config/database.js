import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'mssql',
  server: process.env.SERVER_BD,
  database: process.env.NAME_BD,
  username: process.env.USER_BD,
  password: process.env.PASSWORD_BD,
  port: process.env.PORT,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  }
});

export default db;