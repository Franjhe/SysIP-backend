import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import sql from "mssql";

const sqlConfig = {
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    server: process.env.SERVER_BD,
    database: process.env.NAME_BD,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

const createUsersFromNinja = async(createUsersFromNinja) => {
    try{
        let rowsAffected = 0;
        let pool = await sql.connect(sqlConfig);
        let insert = await pool.request()
          .input('xcorreo', sql.NVarChar, createUsersFromNinja.xcorreo)
          .input('xdocidentidad', sql.Char, createUsersFromNinja.xdocidentidad)
          .input('xcedula', sql.NVarChar, createUsersFromNinja.xcedula)
          .input('xnombre', sql.NVarChar, createUsersFromNinja.xnombre)
          .input('xapellido', sql.NVarChar, createUsersFromNinja.xapellido)
          .input('xestado', sql.NVarChar, createUsersFromNinja.xestado)
          .input('xciudad', sql.NVarChar, createUsersFromNinja.xciudad)
          .input('xmunicipio', sql.NVarChar, createUsersFromNinja.xmunicipio)
          .input('xtelefono', sql.NVarChar, createUsersFromNinja.xtelefono)
          .input('nacompanante', sql.SmallInt, createUsersFromNinja.nacompanante)
          .input('xninjapark', sql.NVarChar, createUsersFromNinja.xninjapark)
          .input('xpregunta', sql.NVarChar, createUsersFromNinja.xpregunta)
          .input('bacepto', sql.Bit, createUsersFromNinja.bacepto)
          .input('bmayor', sql.Bit, createUsersFromNinja.bmayor)
          .input('fcobro', sql.DateTime, createUsersFromNinja.fcobro)
          .input('mmonto', sql.Float, createUsersFromNinja.mmonto)
          .input('bactivo', sql.Bit, 1)
          .input('fcreacion', sql.DateTime, new Date())
          .query('insert into np_recibos (xcorreo, xdocidentidad, xcedula, xnombre, xapellido, xestado, xciudad, xmunicipio, xtelefono, nacompanante, xninjapark, xpregunta, bacepto, bmayor, fcobro, mmonto, bactivo, fcreacion) values (@xcorreo, @xdocidentidad, @xcedula, @xnombre, @xapellido, @xestado, @xciudad, @xmunicipio, @xtelefono, @nacompanante, @xninjapark, @xpregunta, @bacepto, @bmayor, @fcobro, @mmonto, @bactivo, @fcreacion)')        
          rowsAffected = rowsAffected + insert.rowsAffected;
          const createMM = rowsAffected   
          return createMM
    }
    catch(err){
        console.log(err.message)
        return { error: err.message, message: 'Error al crear el Menu Principal, por favor revise.' };
    }
  }

export default {
    createUsersFromNinja
};