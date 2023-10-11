import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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
  

export default {
    searchHullPrice,
    searchOtherPrice
  };