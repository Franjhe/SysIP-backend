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
const Brand = sequelize.define('MAMARCA_WEB', {}, { tableName: 'MAMARCA_WEB' });
const Color = sequelize.define('MACOLOR_WEB', {}, { tableName: 'MACOLOR_WEB' });
const Rates = sequelize.define('PRTARIFA_EXCESO', {}, { tableName: 'PRTARIFA_EXCESO' });
const TypeVehicle = sequelize.define('MATIPOVEHICULO', {}, { tableName: 'MATIPOVEHICULO' });
const Utility = sequelize.define('MAUSOVEHICULO', {}, { tableName: 'MAUSOVEHICULO' });
const Class = sequelize.define('MACLASES_WEB', {}, { tableName: 'MACLASES_WEB' });
const Plan = sequelize.define('PRPLAN_RC', {}, { tableName: 'PRPLAN_RC' });

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
const State = sequelize.define('maestados', {
  cestado: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cpais: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xdescripcion_l: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},);
const City = sequelize.define('maciudades', {
  cciudad: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cpais: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cestado: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xdescripcion_l: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},);
const Model = sequelize.define('MAMODELO_WEB', {
  cmodelo: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cmarca: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xmodelo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, { tableName: 'MAMODELO_WEB' });

const Version = sequelize.define('MAVERSION_WEB', {
  cversion: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  cmarca: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cmodelo: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  xversion: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, { tableName: 'MAVERSION_WEB' });



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

const getState = async (getState) => {
  try {
    const estado = await State.findAll({
      where: getState,
      attributes: ['cestado', 'xdescripcion_l'],
    });
    const state = estado.map((item) => item.get({ plain: true }));
    return state;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

const getCity = async (getCity) => {
  try {
    const ciudad = await City.findAll({
      where: getCity,
      attributes: ['cciudad', 'xdescripcion_l'],
    });
    const city = ciudad.map((item) => item.get({ plain: true }));
    return city;
  } catch (error) {
    console.log(error.message)
    return { error: error.message };
  }
};

const getBrand = async () => {
  try {
    const marca = await Brand.findAll({
      attributes: ['cmarca', 'xmarca'],
    });
    const brand = marca.map((item) => item.get({ plain: true }));
    return brand;
  } catch (error) {
    return { error: error.message };
  }
};

const getModel = async (getModel) => {
  try {
    const modelo = await Model.findAll({
      where: getModel,
      attributes: ['cmodelo', 'xmodelo'],
    });
    const model = modelo.map((item) => item.get({ plain: true }));
    return model;
  } catch (error) {
    return { error: error.message };
  }
};

const getVersion = async (getVersion) => {
  try {
    const versions = await Version.findAll({
      where: getVersion,
      attributes: ['cversion', 'xversion', 'npasajero', 'cano'],
    });
    const version = versions.map((item) => item.get({ plain: true }));
    return version;
  } catch (error) {
    return { error: error.message };
  }
};

const getColor = async () => {
  try {
    const colores = await Color.findAll({
      attributes: ['ccolor', 'xcolor'],
    });
    const color = colores.map((item) => item.get({ plain: true }));
    return color;
  } catch (error) {
    return { error: error.message };
  }
};

const getRates = async () => {
  try {
    const tarifa = await Rates.findAll({
      attributes: ['ctarifa_exceso', 'xgrupo'],
    });
    const rates = tarifa.map((item) => item.get({ plain: true }));
    return rates;
  } catch (error) {
    return { error: error.message };
  }
};

const getTypeVehicle = async () => {
  try {
    const tipo = await TypeVehicle.findAll({
      attributes: ['ctipovehiculo', 'xtipovehiculo'],
    });
    const type = tipo.map((item) => item.get({ plain: true }));
    return type;
  } catch (error) {
    return { error: error.message };
  }
};

const getUtility = async () => {
  try {
    const uso = await Utility.findAll({
      attributes: ['cuso', 'xuso'],
    });
    const utility = uso.map((item) => item.get({ plain: true }));
    return utility;
  } catch (error) {
    return { error: error.message };
  }
};

const getClass = async () => {
  try {
    const clase = await Class.findAll({
      attributes: ['cclase', 'xclase'],
    });
    const classV = clase.map((item) => item.get({ plain: true }));
    return classV;
  } catch (error) {
    return { error: error.message };
  }
};

const getPlan = async () => {
  try {
    const planes = await Plan.findAll({
      attributes: ['cplan_rc', 'xplan_rc'],
    });
    const plan = planes.map((item) => item.get({ plain: true }));
    return plan;
  } catch (error) {
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
  getPark,
  getState,
  getCity,
  getBrand,
  getModel,
  getVersion,
  getColor,
  getRates,
  getTypeVehicle,
  getUtility,
  getClass,
  getPlan
};