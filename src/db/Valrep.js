import sequelize from '../config/database.js';

const Trade = sequelize.define('maramos', {});
const Coin = sequelize.define('mamonedas', {});
const Client = sequelize.define('maclient', {}, { tableName: 'maclient' });
const Broker = sequelize.define('macorredores', {});

const getTrade = async () => {
  try {
    const trade = await Trade.findAll({
      attributes: ['cramo', 'xdescripcion_l'],
    });
    const trades = trade.map((item) => item.get({ plain: true }));
    return trades;
  } catch (error) {
    return { error: error.message };
  }
};

const getCoin = async () => {
  try {
    const coin = await Coin.findAll({
      attributes: ['cmoneda', 'xdescripcion_l'],
    });
    const coins = coin.map((item) => item.get({ plain: true }));
    return coins;
  } catch (error) {
    return { error: error.message };
  }
};

const getClient = async () => {
  try {
    const client = await Client.findAll({
      attributes: ['cci_rif', 'xnombre', 'xapellido'],
    });
    const clients = client.map((item) => item.get({ plain: true }));
    return clients;
  } catch (error) {
    return { error: error.message };
  }
};

const getBrokers = async () => {
  try {
    const broker = await Broker.findAll({
      attributes: ['ccorredor', 'xdescripcion_l'],
    });
    const brokers = broker.map((item) => item.get({ plain: true }));
    return brokers;
  } catch (error) {
    return { error: error.message };
  }
};
  
export default {
  getTrade,
  getCoin,
  getClient,
  getBrokers
};