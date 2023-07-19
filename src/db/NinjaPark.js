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
          .input('tipoid', sql.Char, createUsersFromNinja.data.tipoid)
          .input('cedula', sql.NVarChar, createUsersFromNinja.data.cedula)
          .input('nombApell', sql.NVarChar, createUsersFromNinja.data.nombApell)
          .input('fechanac', sql.NVarChar, createUsersFromNinja.data.fechanac)
          .input('correo', sql.NVarChar, createUsersFromNinja.data.correo)
          .input('nrofac', sql.NVarChar, createUsersFromNinja.data.nrofac)
          .input('cantidad_tickes', sql.SmallInt, createUsersFromNinja.data.cantidad_tickes)
          .input('localidad', sql.NVarChar, createUsersFromNinja.data.localidad)
          .input('plan_adquirido', sql.SmallInt, createUsersFromNinja.data.plan_adquirido)
          .input('fecha_in', sql.NVarChar, createUsersFromNinja.data.fecha_in)
          .input('fecha_out', sql.NVarChar, createUsersFromNinja.data.fecha_out)
          .query('insert into np_recibos (tipoid, cedula, nombApell, fechanac, correo, nrofac, cantidad_tickes, localidad, plan_adquirido, fecha_in, fecha_out) values (@tipoid, @cedula, @nombApell, @fechanac, @correo, @nrofac, @cantidad_tickes, @localidad, @plan_adquirido, @fecha_in, @fecha_out)')  

          if(insert.rowsAffected > 0){
            for(let i = 0; i < createUsersFromNinja.acopanantes.length; i++){
              let insert = await pool.request()
                .input('nrofac', sql.NVarChar, createUsersFromNinja.data.nrofac)
                .input('nombre_acompa', sql.NVarChar, createUsersFromNinja.acopanantes[i].nombre_acompa)
                .input('edad', sql.NVarChar, createUsersFromNinja.acopanantes[i].edad)
                .query('insert into np_acompanantes (nrofac, nombre_acompa, edad) values (@nrofac, @nombre_acompa, @edad)')  
            }
          }
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
        attributes: ['tipoid', 'cedula', 'nombApell', 'fechanac', 'correo', 'nrofac', 'cantidad_tickes',
        'localidad', 'plan_adquirido', 'fecha_in', 'fecha_out', 'cantidad_personas'],
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