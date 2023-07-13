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

const Search = sequelize.define('np_recibos', {});

const createUsersFromNinja = async(createUsersFromNinja) => {
    try{
        let rowsAffected = 0;
        let pool = await sql.connect(sqlConfig);
        let insert = await pool.request()
          .input('tipoid', sql.Char, createUsersFromNinja.tipoid)
          .input('cedula', sql.NVarChar, createUsersFromNinja.cedula)
          .input('nombApell', sql.NVarChar, createUsersFromNinja.nombApell)
          .input('fechanac', sql.NVarChar, createUsersFromNinja.fechanac)
          .input('correo', sql.NVarChar, createUsersFromNinja.correo)
          .input('nrofac', sql.NVarChar, createUsersFromNinja.nrofac)
          .input('cantidad_tickes', sql.SmallInt, createUsersFromNinja.cantidad_tickes)
          .input('localidad', sql.NVarChar, createUsersFromNinja.localidad)
          .input('plan_adquirido', sql.SmallInt, createUsersFromNinja.plan_adquirido)
          .input('fecha_in', sql.NVarChar, createUsersFromNinja.fecha_in)
          .input('fecha_out', sql.NVarChar, createUsersFromNinja.fecha_out)
          .input('cantidad_personas', sql.NVarChar, createUsersFromNinja.cantidad_personas)
          .query('insert into np_recibos (tipoid, cedula, nombApell, fechanac, correo, nrofac, cantidad_tickes, localidad, plan_adquirido, fecha_in, fecha_out, cantidad_personas) values (@tipoid, @cedula, @nombApell, @fechanac, @correo, @nrofac, @cantidad_tickes, @localidad, @plan_adquirido, @fecha_in, @fecha_out, @cantidad_personas)')        
          rowsAffected = rowsAffected + insert.rowsAffected;
          const createUN = rowsAffected   
          return createUN
    }
    catch(err){
        console.log(err.message)
        return { error: err.message, message: 'Error al crear el Menu Principal, por favor revise.' };
    }
  }

  const searchUsersFromNinja = async () => {
    try {
      const searchNinja = await Search.findAll({
        attributes: ['xcorreo', 'xdocidentidad', 'xcedula', 'xnombre', 'xapellido', 'xtelefono', 
                     'xninjapark', 'nacompanante', 'xestado', 'xciudad'],
      });
      const search = searchNinja.map((item) => item.get({ plain: true }));
      return search;
    } catch (error) {
      return { error: error.message };
    }
  };

export default {
    createUsersFromNinja,
    searchUsersFromNinja
};