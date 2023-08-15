import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Trade = sequelize.define('maramos', {});
const Coin = sequelize.define('mamonedas', {});
const Client = sequelize.define('maclient', {}, { tableName: 'maclient' });
const Broker = sequelize.define('macorredores', {});
const Departament = sequelize.define('sedepartamento', {}, { tableName: 'sedepartamento' });
const Users = sequelize.define('seusuariosweb', {}, { tableName: 'seusuariosweb' });
const MainMenu = sequelize.define('semenuprincipal', {}, { tableName: 'semenuprincipal' });
const Park = sequelize.define('np_parques', {});

const Rol = sequelize.define('serol', {
  crol: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cdepartamento: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xrol: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, { tableName: 'serol' });
const Menu = sequelize.define('semenu', {
  cmenu: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cmenu_principal: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xmenu: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, { tableName: 'semenu' });
const SubMenu = sequelize.define('sesubmenu', {
  csubmenu: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cmenu_principal: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cmenu: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xsubmenu: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, { tableName: 'sesubmenu' });


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

const getDepartament = async () => {
  try {
    const departament = await Departament.findAll({
      attributes: ['cdepartamento', 'xdepartamento'],
    });
    const departaments = departament.map((item) => item.get({ plain: true }));
    return departaments;
  } catch (error) {
    return { error: error.message };
  }
};

const getRol = async (rolData) => {
  try {
    const rol = await Rol.findAll({
      where: rolData,
      attributes: ['crol', 'xrol'],
    });
    const rols = rol.map((item) => item.get({ plain: true }));
    return rols;
  } catch (error) {
    return { error: error.message };
  }
};

const getMainMenu = async () => {
  try {
    const menu = await MainMenu.findAll({
      attributes: ['cmenu_principal', 'xmenu'],
    });
    const mainMenu = menu.map((item) => item.get({ plain: true }));
    return mainMenu;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

const getMenu = async (getMenu) => {
  try {
    const menu = await Menu.findAll({
      where: getMenu,
      attributes: ['cmenu', 'xmenu'],
    });
    const menuResult = menu.map((item) => item.get({ plain: true }));
    return menuResult;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

const getSubMenu = async (getSubMenu) => {
  try {
    const submenu = await SubMenu.findAll({
      where: getSubMenu,
      attributes: ['csubmenu', 'xsubmenu'],
    });
    const subMenuResult = submenu.map((item) => item.get({ plain: true }));
    return subMenuResult;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

const getUser = async () => {
  try {
    const user = await Users.findAll({
      attributes: ['cusuario', 'xusuario'],
    });
    const users = user.map((item) => item.get({ plain: true }));
    return users;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

const getPark = async () => {
  try {
    const park = await Park.findAll({
      attributes: ['plan_adquirido', 'xcompania'],
    });
    const parks = park.map((item) => item.get({ plain: true }));
    return parks;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};
  
export default {
  getTrade,
  getCoin,
  getClient,
  getBrokers,
  getDepartament,
  getRol,
  getMainMenu,
  getMenu,
  getUser,
  getSubMenu,
  getPark
};