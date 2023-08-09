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

const NpVacompanantes = sequelize.define('npVacompanantes', {
  nrofac: {
    type: Sequelize.STRING,
    primaryKey: false,
    allowNull: false,
  },
  cedula: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nombre_acompa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  item: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  plan_adquirido: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mcosto_ext: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mcosto_local: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

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
          .input('plan_adquirido', sql.NVarChar, createUsersFromNinja.data.plan_adquirido)
          .input('fecha_in', sql.NVarChar, createUsersFromNinja.data.fecha_in)
          .input('fecha_out', sql.NVarChar, createUsersFromNinja.data.fecha_out)
          .query('insert into np_recibos (tipoid, cedula, nombApell, fechanac, correo, nrofac, cantidad_tickes, localidad, plan_adquirido, fecha_in, fecha_out) values (@tipoid, @cedula, @nombApell, @fechanac, @correo, @nrofac, @cantidad_tickes, @localidad, @plan_adquirido, @fecha_in, @fecha_out)')  

          if(insert.rowsAffected > 0){
            for(let i = 0; i < createUsersFromNinja.acopanantes.length; i++){
              let insert = await pool.request()
                .input('nrofac', sql.NVarChar, createUsersFromNinja.data.nrofac)
                .input('nombre_acompa', sql.NVarChar, createUsersFromNinja.acopanantes[i].nombre_acompa)
                .input('edad', sql.NVarChar, createUsersFromNinja.acopanantes[i].edad)
                .input('cedula', sql.NVarChar, createUsersFromNinja.data.cedula)
                .query('insert into np_acompanantes (nrofac, nombre_acompa, edad, cedula) values (@nrofac, @nombre_acompa, @edad, @cedula)')  
            }
            for(let i = 0; i < createUsersFromNinja.boletos.length; i++){
              let insert = await pool.request()
                .input('nrofac', sql.NVarChar, createUsersFromNinja.data.nrofac)
                .input('item', sql.NVarChar, createUsersFromNinja.boletos[i].item)
                .input('plan_seguro', sql.NVarChar, createUsersFromNinja.boletos[i].plan_seguro)
                .input('uso_futuro', sql.NVarChar, createUsersFromNinja.boletos[i].uso_futuro)
                .input('cedula', sql.NVarChar, createUsersFromNinja.data.cedula)
                .query('insert into np_boletos (nrofac, item, plan_seguro, uso_futuro, cedula) values (@nrofac, @item, @plan_seguro, @uso_futuro, @cedula)')  
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
        'localidad', 'plan_adquirido', 'fecha_in', 'fecha_out', 'hora_fac'],
      });
      const search = searchNinja.map((item) => item.get({ plain: true }));
      return search;
    } catch (error) {
      return { error: error.message };
    }
  };

  const detailUsersFromNinja = async (detailUsersFromNinja) => {
    try {
      const uniqueCompanions = await NpVacompanantes.findAll({
        attributes: [
          'nombre_acompa',
          [Sequelize.fn('MAX', Sequelize.col('item')), 'item'],
          [Sequelize.fn('MAX', Sequelize.col('plan_seguro')), 'plan_seguro'],
          [Sequelize.fn('MAX', Sequelize.col('mcosto_ext')), 'mcosto_ext'],
          [Sequelize.fn('MAX', Sequelize.col('mcosto_local')), 'mcosto_local']
        ],
        where: {
          cedula: detailUsersFromNinja.cedula
        },
        group: ['nombre_acompa'],
        raw: true,
      });
  
      const detail = uniqueCompanions.map((item) => item);
      return detail;
    } catch (error) {
      console.log(error.message)
      return { error: error.message };
    }
  };

export default {
    createUsersFromNinja,
    searchUsersFromNinja,
    detailUsersFromNinja
};