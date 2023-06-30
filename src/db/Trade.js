import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Trade = sequelize.define(
  'maramos',
  {
    cramo: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: false,
    },
    xdescripcion_l: {
      type: DataTypes.CHAR,
      field: 'xdescripcion_l' // Nombre de la columna en la base de datos sin espacios en blanco
    },
  }
);

const getAllTrade = async () => {
  try {
    const trades = await Trade.findAll({
      attributes: [
        'cramo',
        [Sequelize.fn('RTRIM', Sequelize.col('xdescripcion_l')), 'xdescripcion_l']
      ]
    });
    return trades;
  } catch (error) {
    return { error: error.message };
  }
};

export default {
  getAllTrade,
};