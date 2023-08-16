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
          .input('hora_emision', sql.NVarChar, createUsersFromNinja.data.hora_emision)
          .input('fingreso', sql.DateTime, new Date())
          .query('insert into np_recibos (tipoid, cedula, nombApell, fechanac, correo, nrofac, cantidad_tickes, localidad, plan_adquirido, fecha_in, fecha_out, hora_emision, fingreso) values (@tipoid, @cedula, @nombApell, @fechanac, @correo, @nrofac, @cantidad_tickes, @localidad, @plan_adquirido, @fecha_in, @fecha_out, @hora_emision, @fingreso)')  
 
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
                .input('cod_prod', sql.NVarChar, createUsersFromNinja.boletos[i].cod_prod)
                .input('nom_prod', sql.NVarChar, createUsersFromNinja.boletos[i].nom_prod)
                .input('cant_prod', sql.Int, parseInt(createUsersFromNinja.boletos[i].cant_prod))
                .input('plan_seguro', sql.NVarChar, createUsersFromNinja.boletos[i].plan_seguro)
                .input('uso_futuro', sql.NVarChar, createUsersFromNinja.boletos[i].uso_futuro)
                .input('cedula', sql.NVarChar, createUsersFromNinja.data.cedula)
                .query('insert into np_boletos (nrofac, cod_prod, nom_prod, cant_prod, plan_seguro, uso_futuro, cedula) values (@nrofac, @cod_prod, @nom_prod, @cant_prod, @plan_seguro, @uso_futuro, @cedula)')  
            }
          }
          const createUN = rowsAffected   
          return createUN
    }
    catch(err){
        return { error: err.message, message: 'Error al crear el Usuario, por favor revise.' };
    }
  }

  const searchUsersFromNinja = async (searchUsersFromNinja) => {
    try {
      const searchNinja = await Search.findAll({
        attributes: ['tipoid', 'cedula', 'nombApell', 'fechanac', 'correo', 'nrofac', 'cantidad_tickes',
        'localidad', 'mcosto_ext', 'fingreso', 'fecha_out', 'hora_fac'],
        where: {
          plan_adquirido: searchUsersFromNinja.plan_adquirido
        },
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
          [Sequelize.fn('MAX', Sequelize.col('cod_prod')), 'cod_prod'],
          [Sequelize.fn('MAX', Sequelize.col('nom_prod')), 'nom_prod'],
          [Sequelize.fn('MAX', Sequelize.col('cant_prod')), 'cant_prod'],
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
      return { error: error.message };
    }
  };

export default {
    createUsersFromNinja,
    searchUsersFromNinja,
    detailUsersFromNinja
};