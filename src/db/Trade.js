import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Trade = db.define('maramos', {
  cramo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
});

const getAllTrade = async () => {
  try {
    const trades = await Trade.findAll();
    return trades;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

export default {
  getAllTrade
};