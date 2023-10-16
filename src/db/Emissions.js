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

const Clasification = sequelize.define('MACLASIFICACION_VEH', {}, { tableName: 'MACLASIFICACION_VEH' });
const Price = sequelize.define('MATARIFA_CASCO', {}, { tableName: 'MATARIFA_CASCO' });
const OtherPrice = sequelize.define('MATARIFA_OTROS', {}, { tableName: 'MATARIFA_OTROS' });

const searchHullPrice = async (searchHullPrice) => {
    try {
      const clasificacion = await Clasification.findAll({
        where: { xtipo: searchHullPrice.xclase, xmarca: searchHullPrice.xmarca, xmodelo: searchHullPrice.xmodelo },
        attributes: ['xclase'],
      });
  
      const result = clasificacion.map((item) => item.get({ plain: true }));
  
      if (result && result.length > 0) {
        const firstResult = result[0].xclase;
  
        const secondResult = await Price.findOne({
          where: {
            xclase: firstResult,
            cano: searchHullPrice.cano,
            xtipo: searchHullPrice.xclase
          },
          attributes: ['ptasa_casco'],
        });
  
        if (secondResult) {
          const result = secondResult.dataValues.ptasa_casco;
          return result;
        } else {
          return { result: firstResult };
        }
      } else {
        return { result: [] };
      }
    } catch (error) {
      return { error: error.message };
    }
  };

  const searchOtherPrice = async (searchOtherPrice) => {
    try {
      const otros = await OtherPrice.findAll({
        where: {
            xcobertura: searchOtherPrice.xcobertura,
          },
        attributes: ['ptarifa'],
      });
      const rates = otros.map((item) => item.get({ plain: true }));
      return rates;
    } catch (error) {
      return { error: error.message };
    }
  };

  const executePremiumAmount = async (executePremiumAmount) => {
    try{
        let pool = await sql.connect(sqlConfig);
        let result = await pool.request()
        .input('cmetodologiapago', sql.Int, executePremiumAmount.cmetodologiapago)
        .input('cplan_rc', sql.Int, executePremiumAmount.cplan)
        .input('ctarifa_exceso', sql.Int, executePremiumAmount.ctarifa_exceso)
        .input('igrua', sql.Bit, executePremiumAmount.igrua)
        .input('ncapacidad_p', sql.Int, executePremiumAmount.npasajeros)
        .execute('tmBCalculo_Recibo');
         let query= await pool.request()
        .query('select * from TMCALCULO_RECIBO');
        await pool.close();
        return { result: query };
              
    }catch(err){
      console.log(err.message)
        return { error: err.message };
        }
}
  

export default {
    searchHullPrice,
    searchOtherPrice,
    executePremiumAmount
  };